import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link, Upload } from "lucide-react";
import { useState } from "react";

interface AdvertisementInputsProps {
  newAd: {
    position: string;
    link: string;
    image_url: string;
  };
  setNewAd: (ad: any) => void;
  onImageUpload: (file: File) => Promise<void>;
}

export const AdvertisementInputs = ({ newAd, setNewAd, onImageUpload }: AdvertisementInputsProps) => {
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      setNewAd({ ...newAd, image_url: imageUrl });
      setShowUrlDialog(false);
      setImageUrl("");
    }
  };

  return (
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
        <label className="text-sm font-medium">Link (where to redirect when clicked)</label>
        <Input
          type="url"
          value={newAd.link}
          onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Image</label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="relative overflow-hidden"
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>

          <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Link className="w-4 h-4 mr-2" />
                Add Image URL
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
                <Button onClick={handleImageUrlSubmit}>Add Image</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};