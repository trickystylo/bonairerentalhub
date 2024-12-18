import { Input } from "@/components/ui/input";

interface CsvFileInputProps {
  isLoading: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CsvFileInput = ({ isLoading, onChange }: CsvFileInputProps) => {
  return (
    <div className="flex items-center gap-4 max-w-6xl mx-auto mt-4">
      <Input
        type="file"
        accept=".csv"
        onChange={onChange}
        disabled={isLoading}
        className="max-w-[300px]"
      />
      {isLoading && <span className="text-sm text-muted-foreground">Processing...</span>}
    </div>
  );
};