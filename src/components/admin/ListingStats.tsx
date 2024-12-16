import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ListingStatsDetail } from "./ListingStatsDetail";
import { StatsContainer } from "./stats/StatsContainer";

export const ListingStats = () => {
  const [clickStats, setClickStats] = useState<any[]>([]);
  const [selectedListing, setSelectedListing] = useState<any>(null);

  useEffect(() => {
    fetchClickStats();
    
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
  }, []);

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
        <StatsContainer 
          clickStats={clickStats}
          onListingClick={setSelectedListing}
        />
      )}
    </div>
  );
};