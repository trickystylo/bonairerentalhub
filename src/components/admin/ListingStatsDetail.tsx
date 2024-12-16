import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ListingStatsDetailProps {
  listing: any;
  onClose: () => void;
  onReset: () => void;
}

export const ListingStatsDetail = ({ listing, onClose, onReset }: ListingStatsDetailProps) => {
  const [clickData, setClickData] = useState<any[]>([]);

  useEffect(() => {
    processClickData();
  }, [listing]);

  const processClickData = () => {
    const clickTypes = ['website', 'phone', 'whatsapp', 'map'];
    const processedData = clickTypes.map(type => ({
      click_type: type,
      count: listing.listing_clicks?.filter((click: any) => click.click_type === type).length || 0
    }));
    setClickData(processedData);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["Click Type", "Count", "Date"],
      ...listing.listing_clicks.map((click: any) => [
        click.click_type,
        1,
        new Date(click.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${listing.name}-clicks.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const resetClicks = async () => {
    try {
      await supabase
        .from('listing_clicks')
        .delete()
        .eq('listing_id', listing.id);

      await supabase
        .from('listings')
        .update({ total_clicks: 0 })
        .eq('id', listing.id);

      toast({
        title: "Success",
        description: "Click count has been reset",
      });
      onReset();
    } catch (error) {
      console.error("Error resetting clicks:", error);
      toast({
        title: "Error",
        description: "Failed to reset click count",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{listing.name} - Click Statistics</CardTitle>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="destructive" onClick={resetClicks}>
            Reset Clicks
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Click Distribution</h3>
            <BarChart width={600} height={300} data={clickData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="click_type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Click Details</h3>
            <div className="grid grid-cols-4 gap-4">
              {clickData.map((item) => (
                <div key={item.click_type} className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground capitalize">{item.click_type} Clicks</p>
                  <p className="text-2xl font-bold">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};