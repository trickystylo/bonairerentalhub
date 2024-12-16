import { Input } from "@/components/ui/input";

interface StatsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const StatsSearch = ({ value, onChange }: StatsSearchProps) => {
  return (
    <Input
      placeholder="Search listings..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-sm mt-2"
    />
  );
};