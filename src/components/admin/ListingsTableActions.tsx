import { Button } from "@/components/ui/button";
import { Star, Upload } from "lucide-react";
import { ListingImageUpload } from "./ListingImageUpload";

interface ListingsTableActionsProps {
  listingId: string;
  isPremium: boolean;
  onToggleFeatured: () => void;
  onImageUploaded: () => void;
}

export const ListingsTableActions = ({ 
  listingId, 
  isPremium, 
  onToggleFeatured,
  onImageUploaded 
}: ListingsTableActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleFeatured}
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