import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Papa from "papaparse";

interface CsvUploaderProps {
  onUpload: (data: any[]) => void;
  onNewCategories?: (categories: { id: string; name: string }[]) => void;
}

export const CsvUploader = ({ onUpload, onNewCategories }: CsvUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const formatCategoryName = (category: string) => {
    return category
      .replace(/^-+/, '') // Remove leading hyphens
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .trim();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        console.log("Raw CSV data:", results.data);
        
        try {
          const newCategories = new Set<string>();
          
          const formattedData = results.data.map((row: any) => {
            const type = row.type?.toLowerCase() || '';
            let category = type.replace(/\s+/g, '-').toLowerCase();
            
            if (!['auto', 'boot', 'vakantiehuizen', 'watersport', 'equipment'].includes(category)) {
              newCategories.add(category);
            }

            return {
              id: `temp-${Math.random()}`,
              name: row.name,
              category: category,
              displayCategory: formatCategoryName(category),
              rating: parseFloat(row.rating) || 0,
              priceLevel: 2,
              languages: ["NL", "EN", "PAP", "ES"],
              phone: row.phone,
              website: row.website,
              address: `${row.address}, ${row.city}`,
              description: row.description || '',
              amenities: row.amenities ? row.amenities.split('|') : [],
              images: row.images ? [row.images] : [],
              location: {
                latitude: parseFloat(row.latitude) || 0,
                longitude: parseFloat(row.longitude) || 0
              }
            };
          });

          console.log("Formatted data:", formattedData);
          onUpload(formattedData);
          
          if (newCategories.size > 0) {
            const categoryObjects = Array.from(newCategories).map(cat => ({
              id: cat,
              name: formatCategoryName(cat)
            }));
            console.log("New categories:", categoryObjects);
            onNewCategories?.(categoryObjects);
          }
          
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