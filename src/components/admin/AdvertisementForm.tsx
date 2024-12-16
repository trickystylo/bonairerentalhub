import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Upload } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdvertisementFormProps {
  onSubmit: (data: any) => void;
}

export const AdvertisementForm = ({ onSubmit }: AdvertisementFormProps) => {
  const [ads, setAds] = useState<any[]>([]);
  const [newAd, setNewAd] = useState({
    position: "top",
    link: "",
    image_url: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch advertisements",
        variant: "destructive",
      });
      return;
    }
    
    setAds(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newAd);
    setNewAd({ position: "top", link: "", image_url: "" });
    await fetchAds();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, adId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('advertisements')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('advertisements')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('advertisements')
      .update({ image_url: publicUrl })
      .eq('id', adId);

    if (updateError) {
      toast({
        title: "Error",
        description: "Failed to update advertisement",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });

    await fetchAds();
  };

  const handleDeleteConfirm = async () => {
    if (!adToDelete) return;

    const { error } = await supabase
      .from('advertisements')
      .delete()
      .eq('id', adToDelete);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete advertisement",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Advertisement deleted successfully",
    });

    setShowDeleteDialog(false);
    setAdToDelete(null);
    await fetchAds();
  };

  const handleDeleteClick = (id: string) => {
    setAdToDelete(id);
    setShowDeleteDialog(true);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Position</label>
            <select
              className="w-full p-2 border rounded-md bg-background"
              value={newAd.position}
              onChange={(e) => setNewAd({ ...newAd, position: e.target.value })}
            >
              <option value="top">Top</option>
              <option value="sidebar">Sidebar</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Link</label>
            <Input
              type="url"
              value={newAd.link}
              onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        </div>
        <Button type="submit" className="w-full bg-gradient-caribbean">Create Advertisement</Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map((ad) => (
          <Card key={ad.id} className="overflow-hidden">
            <CardContent className="p-4 space-y-4">
              <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                {ad.image_url ? (
                  <img
                    src={ad.image_url}
                    alt="Advertisement"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{ad.position}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative overflow-hidden"
                  >
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, ad.id)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(ad.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Advertisement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this advertisement? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};