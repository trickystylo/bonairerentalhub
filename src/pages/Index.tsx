import { useState } from "react";
import { Header } from "@/components/Header";
import { SearchBar, SearchFilters } from "@/components/SearchBar";
import { BusinessGrid } from "@/components/BusinessGrid";
import { CategoryGrid } from "@/components/CategoryGrid";
import { Navigation } from "@/components/Navigation";
import { BackNavigation } from "@/components/BackNavigation";
import { AdSpace } from "@/components/AdSpace";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    priceRange: [1, 3],
    minRating: 0,
    hasWebsite: false,
    hasPhone: false,
  });
  
  const { language } = useLanguage();
  const t = useTranslation(language);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
          alt="Background"
          className="w-full h-full object-cover opacity-5"
        />
      </div>

      <Header />
      <BackNavigation />
      
      <div className="relative z-10">
        <Navigation 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        <div className="container mx-auto px-4 pt-4">
          <AdSpace position="top" />
          
          <div className="max-w-4xl mx-auto text-center mb-12 space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-caribbean bg-clip-text text-transparent animate-fade-in">
              {t("welcomeMessage")}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {t("siteDescription")}
            </p>
          </div>
          
          <div className="flex gap-8">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
              <CategoryGrid 
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategoryChange}
              />
              <BusinessGrid 
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                searchFilters={searchFilters}
              />
              <AdSpace position="bottom" />
            </div>
            <div className="hidden lg:block">
              <AdSpace position="sidebar" className="sticky top-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;