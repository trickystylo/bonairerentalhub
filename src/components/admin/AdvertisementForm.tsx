import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AdvertisementFormProps {
  onSubmit: (data: any) => void;
}

export const AdvertisementForm = ({ onSubmit }: AdvertisementFormProps) => {
  const [newAd, setNewAd] = useState({
    position: "top",
    link: "",
    image_url: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newAd);
    setNewAd({ position: "top", link: "", image_url: "" });
  };

  return (
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Image URL (optional)</label>
          <Input
            type="url"
            value={newAd.image_url}
            onChange={(e) => setNewAd({ ...newAd, image_url: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
      <Button type="submit" className="w-full bg-gradient-caribbean">Create Advertisement</Button>
    </form>
  );
};