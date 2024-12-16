import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Link, Pencil } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Advertisement {
  id: string;
  position: string;
  link: string;
  image_url: string | null;
  is_active: boolean;
}

interface AdvertisementGridProps {
  ads: Advertisement[];
  onImageUpload: (file: File, adId: string) => Promise<void>;
  onDelete: (id: string) => void;
}

export const AdvertisementGrid = ({ ads, onImageUpload, onDelete }: AdvertisementGridProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editLink, setEditLink] = useState("");

  const handleDeleteClick = (id: string) => {
    setAdToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (adToDelete) {
      onDelete(adToDelete);
      setShowDeleteDialog(false);
      setAdToDelete(null);
    }
  };

  const handleEditClick = (ad: Advertisement) => {
    setEditingAd(ad);
    setEditImageUrl(ad.image_url || "");
    setEditLink(ad.link);
    setShowEditDialog(true);
  };

  const handleEditSave = async () => {
    if (!editingAd) return;

    const updates = {
      ...(editImageUrl !== editingAd.image_url && { image_url: editImageUrl }),
      ...(editLink !== editingAd.link && { link: editLink }),
    };

    if (Object.keys(updates).length === 0) {
      setShowEditDialog(false);
      return;
    }

    const { error } = await supabase
      .from('advertisements')
      .update(updates)
      .eq('id', editingAd.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update advertisement",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Advertisement updated successfully",
    });

    setShowEditDialog(false);
    window.location.reload(); // Refresh to show updated data
  };

  return (
    <>
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
                <div className="space-y-1">
                  <span className="text-sm font-medium capitalize">{ad.position}</span>
                  {ad.link && (
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {ad.link}
                    </p>
                  )}
                </div>
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
                      onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0], ad.id)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(ad)}
                  >
                    <Pencil className="w-4 h-4" />
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

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Advertisement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Redirect Link</label>
              <Input
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
                placeholder="Enter redirect link"
              />
            </div>
            {editImageUrl && (
              <div>
                <p className="text-sm font-medium mb-2">Preview:</p>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={editImageUrl}
                    alt="Advertisement preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};