import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { DuplicateListingDialog } from "./admin/DuplicateListingDialog";
import { parseOpeningHours, parseCsvFile, formatCategoryName } from "@/utils/csvParser";
import { saveCategories, checkDuplicateListing, saveListing } from "@/services/listingService";

interface CsvUploaderProps {
  onUpload: (data: any[]) => void;
  onNewCategories?: (categories: { id: string; name: string }[]) => void;
}

export const CsvUploader = ({ onUpload, onNewCategories }: CsvUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [pendingListingData, setPendingListingData] = useState<any>(null);
  const [duplicateListingName, setDuplicateListingName] = useState("");

  const handleDuplicateAction = async (action: 'create' | 'merge' | 'ignore') => {
    if (!pendingListingData) return;

    try {
      const savedData = await saveListing(pendingListingData, action);
      
      if (savedData) {
        onUpload([savedData]);
        toast({
          title: "Success",
          description: action === 'create' 
            ? "New listing created successfully"
            : "Listing data merged successfully"
        });
      } else {
        toast({ title: "Info", description: "Upload ignored" });
      }

      setShowDuplicateDialog(false);
      setPendingListingData(null);
    } catch (error) {
      console.error("Error handling duplicate action:", error);
      toast({
        title: "Error",
        description: "Failed to process listing",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      const rawData = await parseCsvFile(file);
      const newCategories = new Set<string>();
      
      const formattedData = rawData.map((row: any) => {
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
        const savedCategories = await saveCategories(newCategories);
        onNewCategories?.(savedCategories);
      }

      // Check for duplicates
      const isDuplicate = await checkDuplicateListing(formattedData[0].name);
      
      if (isDuplicate) {
        setDuplicateListingName(formattedData[0].name);
        setPendingListingData(formattedData[0]);
        setShowDuplicateDialog(true);
      } else {
        const savedData = await saveListing(formattedData[0]);
        onUpload([savedData]);
        toast({
          title: "Success",
          description: `Uploaded listing successfully`,
        });
      }
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast({
        title: "Error",
        description: "Failed to process CSV file. Please check the format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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