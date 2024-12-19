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
}: ListingsHeaderProps) => {
  return (
    <div className="space-y-4">
      <ListingsFilter
        onSearch={onSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
    </div>
  );
};