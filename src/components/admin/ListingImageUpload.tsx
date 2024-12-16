import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash, Link } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ListingImageUploadProps {
  listingId: string;
  onImageUploaded: () => void;
}

export const ListingImageUpload = ({ listingId, onImageUploaded }: ListingImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${listingId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('listings')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('listings')
        .getPublicUrl(filePath);

      await updateListingImages(publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      
      onImageUploaded();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl) return;

    try {
      await updateListingImages(imageUrl);
      
      toast({
        title: "Success",
        description: "Image URL added successfully",
      });
      
      setShowUrlDialog(false);
      setImageUrl("");
      onImageUploaded();
    } catch (error) {
      console.error('Error adding image URL:', error);
      toast({
        title: "Error",
        description: "Failed to add image URL",
        variant: "destructive",
      });
    }
  };

  const handleClearImages = async () => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ images: [] })
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: "Images Cleared",
        description: "All images have been removed from this listing",
      });
      
      onImageUploaded();
    } catch (error) {
      console.error('Error clearing images:', error);
      toast({
        title: "Error",
        description: "Failed to clear images",
        variant: "destructive",
      });
    }
  };

  const updateListingImages = async (newImageUrl: string) => {
    const { data: listing } = await supabase
      .from('listings')
      .select('images')
      .eq('id', listingId)
      .single();

    const currentImages = listing?.images || [];
    const updatedImages = [...currentImages, newImageUrl];

    const { error: updateError } = await supabase
      .from('listings')
      .update({ images: updatedImages })
      .eq('id', listingId);

    if (updateError) throw updateError;
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        disabled={isUploading}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="h-5 w-5" />
      </Button>

      <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Link className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image URL</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <Input
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button onClick={handleUrlSubmit}>Add Image</Button>
          </div>
        </DialogContent>
      </Dialog>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearImages}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete all images</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};