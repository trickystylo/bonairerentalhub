import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface StatsTableProps {
  filteredStats: any[];
  onListingClick: (listing: any) => void;
}

export const StatsTable = ({ filteredStats, onListingClick }: StatsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Listing Name</TableHead>
          <TableHead>Total Clicks</TableHead>
          <TableHead>Website Clicks</TableHead>
          <TableHead>Phone Clicks</TableHead>
          <TableHead>WhatsApp Clicks</TableHead>
          <TableHead>Map Clicks</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredStats.map((listing) => {
          const websiteClicks = listing.listing_clicks?.filter((click: any) => click.click_type === 'website').length || 0;
          const phoneClicks = listing.listing_clicks?.filter((click: any) => click.click_type === 'phone').length || 0;
          const whatsappClicks = listing.listing_clicks?.filter((click: any) => click.click_type === 'whatsapp').length || 0;
          const mapClicks = listing.listing_clicks?.filter((click: any) => click.click_type === 'map').length || 0;

          return (
            <TableRow key={listing.id}>
              <TableCell>{listing.name}</TableCell>
              <TableCell>{listing.total_clicks || 0}</TableCell>
              <TableCell>{websiteClicks}</TableCell>
              <TableCell>{phoneClicks}</TableCell>
              <TableCell>{whatsappClicks}</TableCell>
              <TableCell>{mapClicks}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onListingClick(listing)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};