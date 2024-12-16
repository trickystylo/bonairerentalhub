import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingStatsDetail } from "./ListingStatsDetail";
import { StatsSearch } from "./stats/StatsSearch";
import { StatsTable } from "./stats/StatsTable";

export const ListingStats = () => {
  const [clickStats, setClickStats] = useState<any[]>([]);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStats, setFilteredStats] = useState<any[]>([]);

  useEffect(() => {
    fetchClickStats();
    setupRealtimeSubscription();
  }, []);

  useEffect(() => {
    filterStats();
  }, [searchQuery, clickStats]);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('listing-clicks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listing_clicks'
        },
        () => {
          console.log('Received real-time update, refreshing stats...');
          fetchClickStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchClickStats = async () => {
    console.log("Fetching click stats...");
    const { data: listings, error } = await supabase
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

    if (error) {
      console.error("Error fetching click stats:", error);
      return;
    }

    console.log("Received listings data:", listings);
    setClickStats(listings || []);
  };

  const filterStats = () => {
    if (!searchQuery) {
      setFilteredStats(clickStats);
      return;
    }

    const filtered = clickStats.filter(listing =>
      listing.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStats(filtered);
  };

  const handleListingClick = (listing: any) => {
    console.log("Selected listing:", listing);
    setSelectedListing(listing);
  };

  return (
    <div className="space-y-4">
      {selectedListing ? (
        <ListingStatsDetail
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onReset={() => {
            fetchClickStats();
            setSelectedListing(null);
          }}
        />
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm border border-muted animate-fade-in">
          <CardHeader>
            <CardTitle>Listing Statistics</CardTitle>
            <CardDescription>Track engagement with your listings</CardDescription>
            <StatsSearch value={searchQuery} onChange={setSearchQuery} />
          </CardHeader>
          <CardContent>
            <StatsTable 
              filteredStats={filteredStats}
              onListingClick={handleListingClick}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};