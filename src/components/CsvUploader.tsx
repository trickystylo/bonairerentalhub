import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Papa from "papaparse";

interface CsvUploaderProps {
  onUpload: (data: any[]) => void;
}

export const CsvUploader = ({ onUpload }: CsvUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        console.log("Parsed CSV:", results.data);
        
        try {
          const formattedData = results.data.map((row: any) => ({
            id: row.id || `temp-${Math.random()}`,
            name: row.name,
            category: row.category?.toLowerCase() || 'other',
            displayCategory: row.displayCategory,
            rating: parseFloat(row.rating) || 0,
            priceLevel: parseInt(row.priceLevel) || 1,
            languages: row.languages?.split(",") || ["NL", "EN"],
            phone: row.phone,
            website: row.website,
            address: row.address,
            location: {
              latitude: parseFloat(row.latitude) || 0,
              longitude: parseFloat(row.longitude) || 0
            }
          }));

          console.log("Formatted data:", formattedData);
          onUpload(formattedData);
          
          toast({
            title: "Success",
            description: `Uploaded ${formattedData.length} listings successfully`,
          });
        } catch (error) {
          console.error("Error processing CSV:", error);
          toast({
            title: "Error",
            description: "Failed to process CSV file. Please check the format.",
            variant: "destructive",
          });
        }

        setIsLoading(false);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        toast({
          title: "Error",
          description: "Failed to parse CSV file",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="flex items-center gap-4 max-w-6xl mx-auto mt-4">
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        disabled={isLoading}
        className="max-w-[300px]"
      />
      {isLoading && <span className="text-sm text-muted-foreground">Processing...</span>}
    </div>
  );
};