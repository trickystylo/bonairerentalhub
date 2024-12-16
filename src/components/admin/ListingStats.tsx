import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ListingStats = () => {
  const [clickStats, setClickStats] = useState<any[]>([]);

  useEffect(() => {
    fetchClickStats();
  }, []);

  const fetchClickStats = async () => {
    const { data: listings } = await supabase
      .from('listings')
      .select(`
        id,
        name,
        total_clicks,
        listing_clicks (
          click_type,
          created_at
        )
      `)
      .order('total_clicks', { ascending: false });

    if (listings) {
      setClickStats(listings);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-muted animate-fade-in">
      <CardHeader>
        <CardTitle>Listing Statistics</CardTitle>
        <CardDescription>Track engagement with your listings</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing Name</TableHead>
              <TableHead>Total Clicks</TableHead>
              <TableHead>Website Clicks</TableHead>
              <TableHead>Phone Clicks</TableHead>
              <TableHead>WhatsApp Clicks</TableHead>
              <TableHead>Map Clicks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clickStats.map((listing) => {
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};