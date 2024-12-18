import { CsvProcessor } from "./csv/CsvProcessor";

interface CsvUploaderProps {
  onUpload: (data: any[]) => void;
  onNewCategories?: (categories: { id: string; name: string }[]) => void;
}

export const CsvUploader = ({ onUpload, onNewCategories }: CsvUploaderProps) => {
  return (
    <CsvProcessor 
      onUpload={onUpload}
      onNewCategories={onNewCategories}
    />
  );
};