import { Search, SlidersHorizontal, Send } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  priceRange: number[];
  minRating: number;
  hasWebsite: boolean;
  hasPhone: boolean;
}

export const SearchBar = ({ onSearch, onFilterChange }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [1, 3],
    minRating: 0,
    hasWebsite: false,
    hasPhone: false,
  });

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    onSearch(searchTerm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="relative max-w-4xl mx-auto mb-8 md:mb-12 px-4 md:px-0">
      <form onSubmit={handleSearch} className="relative flex">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search rentals in Bonaire..."
            className="w-full pl-12 pr-16 py-3 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl text-sm md:text-base"
          />
          <Button 
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
          >
            <Send className="w-5 h-5 text-primary" />
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button 
              type="button" 
              variant="outline"
              className="ml-2"
            >
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Search Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label>Price Range (€)</Label>
                <Slider
                  defaultValue={filters.priceRange}
                  max={3}
                  min={1}
                  step={1}
                  onValueChange={(value) => handleFilterChange({ priceRange: value })}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Budget</span>
                  <span>Luxury</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <Slider
                  defaultValue={[filters.minRating]}
                  max={5}
                  min={0}
                  step={0.5}
                  onValueChange={(value) => handleFilterChange({ minRating: value[0] })}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Any</span>
                  <span>5 stars</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Has Website</Label>
                <Switch
                  checked={filters.hasWebsite}
                  onCheckedChange={(checked) => handleFilterChange({ hasWebsite: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Has Phone</Label>
                <Switch
                  checked={filters.hasPhone}
                  onCheckedChange={(checked) => handleFilterChange({ hasPhone: checked })}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </form>
      <div className="absolute inset-0 bg-gradient-caribbean opacity-5 blur-lg -z-10"></div>
    </div>
  );
};