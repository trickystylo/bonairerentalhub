import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { parseCsvFile } from "@/utils/csvParser";
import { checkDuplicateListing, saveListing } from "@/services/listingService";
import { CsvFileInput } from "./CsvFileInput";
import { DuplicateListingDialog } from "../admin/DuplicateListingDialog";

interface CsvProcessorProps {
  onUpload: (data: any[]) => void;
  onNewCategories?: (categories: { id: string; name: string }[]) => void;
}

export const CsvProcessor = ({ onUpload, onNewCategories }: CsvProcessorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [pendingListingData, setPendingListingData] = useState<any>(null);
  const [duplicateListingName, setDuplicateListingName] = useState("");

  const processBatch = async (listings: any[], startIdx: number, batchSize: number) => {
    const batch = listings.slice(startIdx, startIdx + batchSize);
    const savedListings = [];

    for (const listing of batch) {
      try {
        console.log(`Processing listing ${listing.name}`);
        const isDuplicate = await checkDuplicateListing(listing.name);
        
        if (isDuplicate) {
          console.log(`Found duplicate listing: ${listing.name}`);
          setDuplicateListingName(listing.name);
          setPendingListingData(listing);
          setShowDuplicateDialog(true);
          return { savedListings, stopProcessing: true };
        }

        const savedData = await saveListing(listing);
        if (savedData) {
          console.log("Successfully saved listing:", savedData);
          savedListings.push(savedData);
        }
      } catch (error) {
        console.error(`Error processing listing ${listing.name}:`, error);
        toast({
          title: "Error",
          description: `Failed to process listing "${listing.name}": ${error.message}`,
          variant: "destructive",
        });
      }
    }

    return { savedListings, stopProcessing: false };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Starting CSV file processing");

    try {
      const rawData = await parseCsvFile(file);
      console.log("Parsed CSV data:", rawData);

      if (!rawData || rawData.length === 0) {
        toast({
          title: "Error",
          description: "No valid data found in CSV file",
          variant: "destructive",
        });
        return;
      }

      const BATCH_SIZE = 50; // Process 50 listings at a time
      const allSavedListings = [];
      
      for (let i = 0; i < rawData.length; i += BATCH_SIZE) {
        const { savedListings, stopProcessing } = await processBatch(rawData, i, BATCH_SIZE);
        allSavedListings.push(...savedListings);
        
        if (stopProcessing) {
          console.log("Stopping batch processing due to duplicate");
          return;
        }

        // Update progress
        const progress = Math.min(100, (i + BATCH_SIZE) / rawData.length * 100);
        console.log(`Processing progress: ${progress.toFixed(1)}%`);
      }

      if (allSavedListings.length > 0) {
        onUpload(allSavedListings);
        toast({
          title: "Success",
          description: `Successfully uploaded ${allSavedListings.length} listings`,
        });
      }
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process CSV file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCsvAction = async (action: 'create' | 'merge' | 'ignore') => {
    if (!pendingListingData) return;

    try {
      console.log("Processing duplicate action:", action, "for listing:", pendingListingData);
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
        description: `Failed to process listing: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <CsvFileInput isLoading={isLoading} onChange={handleFileUpload} />
      <DuplicateListingDialog
        isOpen={showDuplicateDialog}
        onClose={() => setShowDuplicateDialog(false)}
        onAction={handleCsvAction}
        duplicateName={duplicateListingName}
      />
    </>
  );
};