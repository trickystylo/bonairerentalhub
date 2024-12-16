import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingsHeader } from "./ListingsHeader";
import { ListingsTable } from "../ListingsTable";
import { useListingsFilter } from "@/hooks/useListingsFilter";

interface ListingsManageSectionProps {
  listings: any[];
  onDelete: (ids: string[]) => void;
}

export const ListingsManageSection = ({ 
  listings,
  onDelete 
}: ListingsManageSectionProps) => {
  const {
    filteredListings,
    selectedCategory,
    handleSearch,
    handleCategoryChange
  } = useListingsFilter(listings);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-muted animate-fade-in mt-8">
      <CardHeader>
        <CardTitle>Manage Listings</CardTitle>
        <CardDescription>View and manage all listings</CardDescription>
      </CardHeader>
      <CardContent>
        <ListingsHeader
          onSearch={handleSearch}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onDelete={onDelete}
          listings={filteredListings}
        />
        <ListingsTable 
          listings={filteredListings}
          onDelete={onDelete}
          currentPage={1}
          hasMore={false}
        />
      </CardContent>
    </Card>
  );
};