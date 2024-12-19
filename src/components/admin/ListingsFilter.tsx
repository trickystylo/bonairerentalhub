import { Input } from "@/components/ui/input";
import { CategoryFilters } from "@/components/CategoryFilters";

interface ListingsFilterProps {
  onSearch: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const ListingsFilter = ({
  onSearch,
  selectedCategory,
  onCategoryChange,
}: ListingsFilterProps) => {
  return (
    <div className="space-y-4 mb-6">
      <Input
        placeholder="Search listings..."
        onChange={(e) => onSearch(e.target.value)}
        className="max-w-md"
      />
      <CategoryFilters
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
    </div>
  );
};