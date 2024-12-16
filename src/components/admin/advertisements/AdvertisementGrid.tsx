import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Upload } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";

interface AdvertisementGridProps {
  ads: any[];
  onImageUpload: (file: File, adId: string) => Promise<void>;
  onDelete: (id: string) => void;
}

export const AdvertisementGrid = ({ ads, onImageUpload, onDelete }: AdvertisementGridProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);

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
    </>
  );
};