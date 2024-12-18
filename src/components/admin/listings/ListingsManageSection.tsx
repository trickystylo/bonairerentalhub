import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingsHeader } from "./ListingsHeader";
import { ListingsTable } from "../ListingsTable";
import { useListingsFilter } from "@/hooks/useListingsFilter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog";

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

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteAll = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(listings.map(listing => listing.id));
    setShowDeleteDialog(false);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-muted animate-fade-in mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Manage Listings</CardTitle>
            <CardDescription>View and manage all listings</CardDescription>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteAll}
          >
            Delete All Listings
          </Button>
        </div>
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

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        itemCount={listings.length}
      />
    </Card>
  );
};