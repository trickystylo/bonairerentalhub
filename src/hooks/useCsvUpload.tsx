import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useCsvUpload = (onListingsUpdate: () => void) => {
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateListingName, setDuplicateListingName] = useState("");
  const [pendingListingData, setPendingListingData] = useState<any>(null);

  const handleCsvUpload = async (data: any[]) => {
    if (data && data.length > 0) {
      setPendingListingData(data[0]);
      setDuplicateListingName(data[0].name || '');
      setShowDuplicateDialog(true);
    }
  };

  const handleCsvAction = async (action: "create" | "merge" | "ignore") => {
    if (!pendingListingData) return;
    
    if (action === "create") {
      const { error } = await supabase
        .from('listings')
        .insert([pendingListingData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create listings",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Listings created successfully",
      });
      onListingsUpdate();
    }
    
    setPendingListingData(null);
    setShowDuplicateDialog(false);
  };

  return {
    showDuplicateDialog,
    duplicateListingName,
    handleCsvUpload,
    handleCsvAction,
    setShowDuplicateDialog
  };
};