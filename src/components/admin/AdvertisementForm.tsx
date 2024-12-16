import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdvertisementInputs } from "./advertisements/AdvertisementInputs";
import { AdvertisementGrid } from "./advertisements/AdvertisementGrid";

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

  const handleImageUpload = async (file: File) => {
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

    setNewAd({ ...newAd, image_url: publicUrl });
    
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });
  };

  const handleAdImageUpload = async (file: File, adId: string) => {
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

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('advertisements')
      .delete()
      .eq('id', id);

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

    await fetchAds();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdvertisementInputs
          newAd={newAd}
          setNewAd={setNewAd}
          onImageUpload={handleImageUpload}
        />
        <Button type="submit" className="w-full bg-gradient-caribbean">
          Create Advertisement
        </Button>
      </form>

      <AdvertisementGrid
        ads={ads}
        onImageUpload={handleAdImageUpload}
        onDelete={handleDelete}
      />
    </div>
  );
};