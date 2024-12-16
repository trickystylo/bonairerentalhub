import { Button } from "@/components/ui/button";
import { ListingsFilter } from "../ListingsFilter";

interface ListingsHeaderProps {
  onSearch: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onDelete: (ids: string[]) => void;
  listings: any[];
}

export const ListingsHeader = ({
  onSearch,
  selectedCategory,
  onCategoryChange,
  onDelete,
  listings,
}: ListingsHeaderProps) => {
  return (
    <div className="space-y-4">
      <ListingsFilter
        onSearch={onSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
      <div className="flex justify-end space-x-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(listings.map(listing => listing.id))}
        >
          Delete All
        </Button>
      </div>
    </div>
  );
};