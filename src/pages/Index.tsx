import { useState } from "react";
import { Header } from "@/components/Header";
import { SearchBar, SearchFilters } from "@/components/SearchBar";
import { BusinessGrid } from "@/components/BusinessGrid";
import { CategoryGrid } from "@/components/CategoryGrid";
import { BackNavigation } from "@/components/BackNavigation";
import { AdSpace } from "@/components/AdSpace";
import { FeaturedListings } from "@/components/FeaturedListings";
import { BackToTop } from "@/components/BackToTop";
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
    const resultsElement = document.getElementById('search-results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
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
          src="https://images.unsplash.com/photo-1589519160732-57fc498494f8"
          alt="Caribbean Background"
          className="w-full h-full object-cover opacity-5"
        />
      </div>

      <Header />
      <BackNavigation />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-4">
          <AdSpace position="top" />
          
          <div className="max-w-4xl mx-auto text-center mb-8 space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-caribbean bg-clip-text text-transparent animate-fade-in">
              {t('welcomeTitle')}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {t('welcomeDescription')}
            </p>
          </div>

          <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />

          <div className="max-w-4xl mx-auto">
            <CategoryGrid 
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategoryChange}
            />
          </div>
          
          <FeaturedListings />
          
          <div className="flex gap-8 mt-8">
            <div className="flex-1">
              <div id="search-results">
                <BusinessGrid 
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                  searchFilters={searchFilters}
                />
              </div>
              <div className="mb-16">
                <AdSpace position="bottom" />
              </div>
            </div>
            <div className="hidden lg:block w-64">
              <AdSpace position="sidebar" className="sticky top-24" />
            </div>
          </div>
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default Index;