import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { DuplicateListingDialog } from "./admin/DuplicateListingDialog";
import { parseCsvFile } from "@/utils/csvParser";
import { checkDuplicateListing, saveListing } from "@/services/listingService";
import { saveCategories } from "@/services/categoryService";

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
      console.log("Raw CSV data:", rawData);

      // Extract unique categories
      const newCategories = new Set<string>();
      rawData.forEach((listing: any) => {
        if (listing.categoryname) {
          newCategories.add(listing.categoryname);
        }
      });

      // Save new categories if any
      if (newCategories.size > 0) {
        console.log("Saving new categories:", newCategories);
        const savedCategories = await saveCategories(newCategories);
        if (savedCategories && onNewCategories) {
          onNewCategories(savedCategories);
        }
      }

      // Process all listings
      const savedListings = [];
      for (const listing of rawData) {
        try {
          // Check for duplicates
          const isDuplicate = await checkDuplicateListing(listing.name);
          
          if (isDuplicate) {
            // For the first duplicate, show the dialog
            if (savedListings.length === 0) {
              setDuplicateListingName(listing.name);
              setPendingListingData(listing);
              setShowDuplicateDialog(true);
              setIsLoading(false);
              return;
            } else {
              // Skip other duplicates but notify
              console.log(`Skipping duplicate listing: ${listing.name}`);
              continue;
            }
          }

          const savedData = await saveListing(listing);
          if (savedData) {
            savedListings.push(savedData);
          }
        } catch (error) {
          console.error(`Error processing listing ${listing.name}:`, error);
          toast({
            title: "Error",
            description: `Failed to process listing: ${listing.name}`,
            variant: "destructive",
          });
        }
      }

      if (savedListings.length > 0) {
        onUpload(savedListings);
        toast({
          title: "Success",
          description: `Successfully uploaded ${savedListings.length} listings`,
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