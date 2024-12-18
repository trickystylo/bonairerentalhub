import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingsHeader } from "./ListingsHeader";
import { ListingsTable } from "../ListingsTable";
import { useListingsFilter } from "@/hooks/useListingsFilter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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

  const handleConfirmDelete = async () => {
    try {
      console.log("Starting deletion process...");
      const listingIds = listings.map(listing => listing.id);
      
      // First delete all related clicks
      const { error: clicksError } = await supabase
        .from('listing_clicks')
        .delete()
        .in('listing_id', listingIds);

      if (clicksError) {
        console.error("Error deleting clicks:", clicksError);
        throw clicksError;
      }

      console.log("Successfully deleted related clicks");

      // Then delete the listings
      const { error: listingsError } = await supabase
        .from('listings')
        .delete()
        .in('id', listingIds);

      if (listingsError) {
        console.error("Error deleting listings:", listingsError);
        throw listingsError;
      }

      console.log("Successfully deleted listings");
      
      toast({
        title: "Success",
        description: "All listings have been deleted",
      });

      onDelete(listingIds);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error in deletion process:", error);
      toast({
        title: "Error",
        description: "Failed to delete listings",
        variant: "destructive",
      });
    }
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