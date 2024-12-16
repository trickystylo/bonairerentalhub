import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { ListingImageUpload } from "./ListingImageUpload";
import { useState } from "react";

interface ListingsTableActionsProps {
  listingId: string;
  isPremium: boolean;
  onToggleFeatured: () => void;
  onImageUploaded: () => void;
}

export const ListingsTableActions = ({ 
  listingId, 
  isPremium: initialIsPremium, 
  onToggleFeatured,
  onImageUploaded 
}: ListingsTableActionsProps) => {
  const [isPremium, setIsPremium] = useState(initialIsPremium);

  const handleToggleFeatured = () => {
    setIsPremium(!isPremium);
    onToggleFeatured();
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleFeatured}
        className={isPremium ? "text-yellow-500" : "text-gray-400"}
      >
        <Star className="h-5 w-5" fill={isPremium ? "currentColor" : "none"} />
      </Button>
      <ListingImageUpload 
        listingId={listingId}
        onImageUploaded={onImageUploaded}
      />
    </div>
  );
};