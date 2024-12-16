import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CsvUploader } from "@/components/CsvUploader";
import { DuplicateListingDialog } from "../DuplicateListingDialog";
import { useCsvUpload } from "@/hooks/useCsvUpload";

interface CsvSectionProps {
  onListingsUpdate: () => void;
}

export const CsvSection = ({ onListingsUpdate }: CsvSectionProps) => {
  const {
    showDuplicateDialog,
    duplicateListingName,
    handleCsvUpload,
    handleCsvAction,
    setShowDuplicateDialog
  } = useCsvUpload(onListingsUpdate);

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm border border-muted animate-fade-in">
        <CardHeader>
          <CardTitle>Upload Listings</CardTitle>
          <CardDescription>Upload your CSV file with listing data</CardDescription>
        </CardHeader>
        <CardContent>
          <CsvUploader onUpload={handleCsvUpload} />
        </CardContent>
      </Card>

      <DuplicateListingDialog
        isOpen={showDuplicateDialog}
        onClose={() => setShowDuplicateDialog(false)}
        onAction={handleCsvAction}
        duplicateName={duplicateListingName}
      />
    </>
  );
};