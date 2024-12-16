import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ListingsTableProps {
  listings: any[];
  onDelete: (id: string) => void;
}

export const ListingsTable = ({ listings, onDelete }: ListingsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
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
              <TableCell className="font-medium">{listing.name}</TableCell>
              <TableCell>{listing.display_category}</TableCell>
              <TableCell>{listing.rating}</TableCell>
              <TableCell>{"€".repeat(listing.price_level)}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(listing.id)}
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
  );
};