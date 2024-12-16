import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";
import { DuplicateListingDialog } from "./admin/DuplicateListingDialog";

interface CsvUploaderProps {
  onUpload: (data: any[]) => void;
  onNewCategories?: (categories: { id: string; name: string }[]) => void;
}

export const CsvUploader = ({ onUpload, onNewCategories }: CsvUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [pendingListingData, setPendingListingData] = useState<any>(null);
  const [duplicateListingName, setDuplicateListingName] = useState("");

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

  const handleDuplicateAction = async (action: 'create' | 'merge' | 'ignore') => {
    if (!pendingListingData) return;

    try {
      switch (action) {
        case 'create':
          const { error: createError } = await supabase
            .from('listings')
            .insert([pendingListingData]);
          
          if (createError) throw createError;
          toast({ title: "Success", description: "New listing created successfully" });
          break;

        case 'merge':
          const { error: mergeError } = await supabase
            .from('listings')
            .update(pendingListingData)
            .eq('name', pendingListingData.name);
          
          if (mergeError) throw mergeError;
          toast({ title: "Success", description: "Listing data merged successfully" });
          break;

        case 'ignore':
          toast({ title: "Info", description: "Upload ignored" });
          break;
      }

      setShowDuplicateDialog(false);
      setPendingListingData(null);
      onUpload([pendingListingData]);
    } catch (error) {
      console.error("Error handling duplicate action:", error);
      toast({
        title: "Error",
        description: "Failed to process listing",
        variant: "destructive",
      });
    }
  };

  const saveToSupabase = async (formattedData: any[]) => {
    try {
      console.log("Saving to Supabase:", formattedData);
      
      // Check for duplicates first
      const { data: existingListing } = await supabase
        .from('listings')
        .select('name')
        .eq('name', formattedData[0].name)
        .single();

      if (existingListing) {
        setDuplicateListingName(formattedData[0].name);
        setPendingListingData(formattedData[0]);
        setShowDuplicateDialog(true);
        return null;
      }

      const { data, error } = await supabase
        .from('listings')
        .insert(formattedData)
        .select();

      if (error) throw error;

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
            
            if (category && !['auto', 'boot', 'vakantiehuizen', 'watersport', 'equipment'].includes(category)) {
              newCategories.add(category);
            }

            return {
              name: row.name,
              category: category,
              display_category: formatCategoryName(category),
              rating: parseFloat(row.rating) || 0,
              total_reviews: parseInt(row.total_reviews) || 0,
              price_level: parseInt(row.price_level) || 2,
              languages: row.languages ? row.languages.split(',').map((l: string) => l.trim()) : ["NL", "EN", "PAP", "ES"],
              phone: row.phone,
              website: row.website,
              address: row.address,
              country: row.country || 'Bonaire',
              postal_code: row.postal_code,
              area: row.area,
              description: row.description || '',
              amenities: row.amenities ? row.amenities.split(',').map((a: string) => a.trim()) : [],
              images: row.images ? (typeof row.images === 'string' ? [row.images] : row.images) : [],
              latitude: parseFloat(row.latitude) || 0,
              longitude: parseFloat(row.longitude) || 0,
              opening_hours: parseOpeningHours(row.opening_hours),
              price_range: row.price_range,
              status: 'active'
            };
          });

          if (newCategories.size > 0) {
            const categoryObjects = Array.from(newCategories)
              .filter(cat => cat) // Filter out empty categories
              .map(cat => ({
                id: cat,
                name: formatCategoryName(cat),
                icon: '🏠'
              }));

            // Insert categories one by one to handle duplicates gracefully
            for (const category of categoryObjects) {
              const { error } = await supabase
                .from('categories')
                .insert(category)
                .select()
                .single();
              
              if (error && error.code !== '23505') { // Ignore duplicate key errors
                console.error("Error saving category:", error);
              }
            }

            onNewCategories?.(categoryObjects);
          }

          const savedData = await saveToSupabase(formattedData);
          if (savedData) {
            onUpload(savedData);
            toast({
              title: "Success",
              description: `Uploaded ${formattedData.length} listings successfully`,
            });
          }
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
    <>
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
      
      <DuplicateListingDialog
        isOpen={showDuplicateDialog}
        onClose={() => setShowDuplicateDialog(false)}
        onAction={handleDuplicateAction}
        duplicateName={duplicateListingName}
      />
    </>
  );
};