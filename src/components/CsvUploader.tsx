import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";

interface CsvUploaderProps {
  onUpload: (data: any[]) => void;
  onNewCategories?: (categories: { id: string; name: string }[]) => void;
}

export const CsvUploader = ({ onUpload, onNewCategories }: CsvUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const formatCategoryName = (category: string) => {
    return category
      .replace(/^-+/, '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .trim();
  };

  const parseOpeningHours = (openingHours: string) => {
    try {
      if (!openingHours) return null;
      
      // Parse HH:MM-HH:MM format into a structured object
      const [start, end] = openingHours.split('-');
      return {
        monday: { open: start, close: end },
        tuesday: { open: start, close: end },
        wednesday: { open: start, close: end },
        thursday: { open: start, close: end },
        friday: { open: start, close: end },
        saturday: { open: start, close: end },
        sunday: { open: start, close: end }
      };
    } catch (error) {
      console.error("Error parsing opening hours:", error);
      return null;
    }
  };

  const saveToSupabase = async (formattedData: any[]) => {
    try {
      console.log("Saving to Supabase:", formattedData);
      const { data, error } = await supabase
        .from('listings')
        .insert(formattedData)
        .select();

      if (error) {
        console.error("Error saving to Supabase:", error);
        throw error;
      }

      console.log("Successfully saved to Supabase:", data);
      return data;
    } catch (error) {
      console.error("Error in saveToSupabase:", error);
      throw error;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        console.log("Raw CSV data:", results.data);
        
        try {
          const newCategories = new Set<string>();
          
          const formattedData = results.data.map((row: any) => {
            const type = row.type?.toLowerCase() || '';
            let category = type.replace(/\s+/g, '-').toLowerCase();
            
            if (!['auto', 'boot', 'vakantiehuizen', 'watersport', 'equipment'].includes(category)) {
              newCategories.add(category);
            }

            // Handle images - if it's a string, convert to array
            const images = row.images ? 
              (typeof row.images === 'string' ? [row.images] : row.images) : 
              [];

            // Handle amenities - if it's a string, split by commas
            const amenities = row.amenities ? 
              (typeof row.amenities === 'string' ? row.amenities.split(',').map(a => a.trim()) : row.amenities) : 
              [];

            return {
              name: row.name,
              category: category,
              display_category: formatCategoryName(category),
              rating: parseFloat(row.rating) || 0,
              total_reviews: parseInt(row.total_reviews) || 0,
              price_level: 2,
              languages: ["NL", "EN", "PAP", "ES"],
              phone: row.phone,
              website: row.website,
              address: row.address,
              country: row.country || 'Bonaire',
              postal_code: row.postal_code,
              area: row.area,
              description: row.description || '',
              amenities: amenities,
              images: images,
              latitude: parseFloat(row.latitude) || 0,
              longitude: parseFloat(row.longitude) || 0,
              opening_hours: parseOpeningHours(row.opening_hours),
              price_range: row.price_range,
              status: 'active'
            };
          });

          console.log("Formatted data:", formattedData);
          
          // Save to Supabase
          const savedData = await saveToSupabase(formattedData);
          onUpload(savedData);
          
          if (newCategories.size > 0) {
            const categoryObjects = Array.from(newCategories).map(cat => ({
              id: cat,
              name: formatCategoryName(cat)
            }));
            console.log("New categories:", categoryObjects);
            
            // Save new categories to Supabase
            const { error: categoryError } = await supabase
              .from('categories')
              .insert(categoryObjects);

            if (categoryError) {
              console.error("Error saving categories:", categoryError);
              toast({
                title: "Warning",
                description: "Listings saved but failed to save new categories",
                variant: "destructive",
              });
            } else {
              onNewCategories?.(categoryObjects);
            }
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