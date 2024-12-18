import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { ListingsTableActions } from "./ListingsTableActions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ListingsTableProps {
  listings: any[];
  onDelete: (ids: string[]) => void;
  currentPage?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const ListingsTable = ({ 
  listings,
  onDelete,
  currentPage = 1,
  onLoadMore,
  hasMore = false
}: ListingsTableProps) => {
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedListings(listings.map(listing => listing.id));
    } else {
      setSelectedListings([]);
    }
  };

  const handleSelectListing = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedListings([...selectedListings, id]);
    } else {
      setSelectedListings(selectedListings.filter(listingId => listingId !== id));
    }
  };

  const handleDeleteClick = (ids: string[]) => {
    setPendingDeleteIds(ids);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(pendingDeleteIds);
    setShowDeleteDialog(false);
    setPendingDeleteIds([]);
    setSelectedListings([]);
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ is_premium: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentStatus ? "Removed from featured" : "Added to featured",
        description: `Listing has been ${currentStatus ? 'removed from' : 'added to'} featured listings.`,
      });
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedListings.length === listings.length}
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
          />
          <span className="text-sm text-gray-500">
            {selectedListings.length} selected
          </span>
        </div>
        <div className="space-x-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteClick(selectedListings)}
            disabled={selectedListings.length === 0}
          >
            Delete Selected
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteClick(listings.map(listing => listing.id))}
          >
            Delete All
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedListings.length === listings.length}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Price Level</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <Checkbox
                    checked={selectedListings.includes(listing.id)}
                    onCheckedChange={(checked) => handleSelectListing(listing.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">{listing.name}</TableCell>
                <TableCell>{listing.display_category}</TableCell>
                <TableCell>{listing.rating}</TableCell>
                <TableCell>{"€".repeat(listing.price_level)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <ListingsTableActions
                      listingId={listing.id}
                      isPremium={listing.is_premium}
                      onToggleFeatured={() => handleToggleFeatured(listing.id, listing.is_premium)}
                      onImageUploaded={() => {
                        toast({
                          title: "Success",
                          description: "Image uploaded successfully",
                        });
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick([listing.id])}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button onClick={onLoadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        itemCount={pendingDeleteIds.length}
      />
    </div>
  );
};
