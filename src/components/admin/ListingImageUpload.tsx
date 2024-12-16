import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ListingImageUploadProps {
  listingId: string;
  onImageUploaded: () => void;
}

export const ListingImageUpload = ({ listingId, onImageUploaded }: ListingImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

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

      const { error: updateError } = await supabase
        .from('listings')
        .update({ 
          images: supabase.sql`array_append(COALESCE(images, ARRAY[]::text[]), ${publicUrl})`
        })
        .eq('id', listingId);

      if (updateError) throw updateError;

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

  return (
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
  );
};