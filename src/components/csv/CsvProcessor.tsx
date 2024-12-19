import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { parseCsvFile } from "@/utils/csvParser";
import { checkDuplicateListing, saveListing } from "@/services/listingService";
import { saveCategories } from "@/services/categoryService";
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

  const processCategories = async (rawData: any[]) => {
    const newCategories = new Set<string>();
    rawData.forEach((listing: any) => {
      if (listing.categoryname) {
        newCategories.add(listing.categoryname);
      }
    });

    if (newCategories.size > 0) {
      console.log("Processing categories:", newCategories);
      const savedCategories = await saveCategories(newCategories);
      if (savedCategories && onNewCategories) {
        onNewCategories(savedCategories);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
        setIsLoading(false);
        return;
      }

      // Process categories first
      await processCategories(rawData);

      // Process listings
      const savedListings = [];
      for (const listing of rawData) {
        try {
          console.log("Processing listing:", listing);
          const isDuplicate = await checkDuplicateListing(listing.name);
          
          if (isDuplicate) {
            console.log(`Found duplicate listing: ${listing.name}`);
            setDuplicateListingName(listing.name);
            setPendingListingData(listing);
            setShowDuplicateDialog(true);
            setIsLoading(false);
            return;
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

  const handleDuplicateAction = async (action: 'create' | 'merge' | 'ignore') => {
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
        description: "Failed to process listing",
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
        onAction={handleDuplicateAction}
        duplicateName={duplicateListingName}
      />
    </>
  );
};