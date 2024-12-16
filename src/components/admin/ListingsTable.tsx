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
import { useState } from "react";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

interface ListingsTableProps {
  listings: any[];
  onDelete: (ids: string[]) => void;
}

export const ListingsTable = ({ listings, onDelete }: ListingsTableProps) => {
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
            className="hover:scale-105 transition-transform"
          >
            Delete Selected
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteClick(listings.map(listing => listing.id))}
            className="hover:scale-105 transition-transform"
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
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick([listing.id])}
                    className="hover:scale-105 transition-transform"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        itemCount={pendingDeleteIds.length}
      />
    </div>
  );
};