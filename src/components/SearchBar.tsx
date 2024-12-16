import { Search, Send } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations";
import { Button } from "./ui/button";

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
  const { language } = useLanguage();
  const t = useTranslation(language);

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

  return (
    <div className="relative max-w-4xl mx-auto mb-8 md:mb-12 px-4 md:px-0">
      <form onSubmit={handleSearch} className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl text-sm md:text-base"
          />
        </div>
        <Button 
          type="submit"
          className="h-full px-6 rounded-xl md:rounded-2xl bg-gradient-caribbean hover:opacity-90 transition-opacity"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
      <div className="absolute inset-0 bg-gradient-caribbean opacity-5 blur-lg -z-10"></div>
    </div>
  );
};