import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatsHeader } from "./StatsHeader";
import { StatsSearch } from "./StatsSearch";
import { StatsTable } from "./StatsTable";
import { useState } from "react";

interface StatsContainerProps {
  clickStats: any[];
  onListingClick: (listing: any) => void;
}

export const StatsContainer = ({ clickStats, onListingClick }: StatsContainerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredStats = clickStats.filter(listing =>
    !searchQuery || listing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-muted animate-fade-in">
      <CardHeader>
        <StatsHeader />
        <StatsSearch value={searchQuery} onChange={setSearchQuery} />
      </CardHeader>
      <CardContent>
        <StatsTable 
          filteredStats={filteredStats}
          onListingClick={onListingClick}
        />
      </CardContent>
    </Card>
  );
};