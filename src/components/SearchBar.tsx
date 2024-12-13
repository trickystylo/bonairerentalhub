import { Search } from "lucide-react";
import { useState } from "react";

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log("Searching for:", e.target.value);
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-8 md:mb-12 px-4 md:px-0">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search rentals in Bonaire..."
          className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl text-sm md:text-base"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-caribbean opacity-5 blur-lg -z-10"></div>
    </div>
  );
};