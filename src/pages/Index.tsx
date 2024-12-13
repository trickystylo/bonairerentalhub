import { useState } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { BusinessGrid } from "@/components/BusinessGrid";
import { CsvUploader } from "@/components/CsvUploader";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [additionalListings, setAdditionalListings] = useState<any[]>([]);
  const [additionalCategories, setAdditionalCategories] = useState<{ id: string; name: string }[]>([]);
  const { language } = useLanguage();
  const t = useTranslation(language);

  const handleCsvUpload = (data: any[]) => {
    console.log("Received CSV data in Index:", data);
    setAdditionalListings(data);
  };

  const handleNewCategories = (categories: { id: string; name: string }[]) => {
    console.log("New categories received:", categories);
    setAdditionalCategories(prevCategories => {
      const newCategories = categories.filter(cat => 
        !prevCategories.some(prevCat => prevCat.id === cat.id)
      );
      return [...prevCategories, ...newCategories];
    });
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
          alt="Background"
          className="w-full h-full object-cover opacity-5"
        />
      </div>

      <Header />
      
      <div className="relative z-10">
        <Navigation 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          additionalCategories={additionalCategories}
        />
        
        <div className="flex gap-4 px-4 lg:px-8 mt-24">
          {/* Left Advertisement Sidebar */}
          <aside className="hidden lg:block w-64 space-y-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <h3 className="font-semibold text-lg mb-2">Featured Rentals</h3>
              <div className="space-y-2">
                <div className="bg-accent p-3 rounded">
                  <p className="font-medium">Premium Car Rental</p>
                  <p className="text-sm text-gray-600">Special Discount: 20% off</p>
                </div>
                <div className="bg-accent p-3 rounded">
                  <p className="font-medium">Luxury Boat Tours</p>
                  <p className="text-sm text-gray-600">Book Now & Save</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-6xl mx-auto">
            <div className="max-w-4xl mx-auto text-center mb-12 space-y-6">
              <h1 className="text-5xl font-bold bg-gradient-caribbean bg-clip-text text-transparent animate-fade-in">
                {t("welcomeMessage")}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                {t("siteDescription")}
              </p>
              <p className="text-lg text-gray-500 italic">
                Discover paradise at your fingertips - Your trusted guide to Bonaire's finest rentals
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-caribbean opacity-5 blur-xl"></div>
              <SearchBar />
            </div>

            <CsvUploader 
              onUpload={handleCsvUpload}
              onNewCategories={handleNewCategories}
            />
            <BusinessGrid 
              selectedCategory={selectedCategory}
              additionalListings={additionalListings}
            />
          </main>

          {/* Right Advertisement Sidebar */}
          <aside className="hidden lg:block w-64 space-y-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <h3 className="font-semibold text-lg mb-2">Special Offers</h3>
              <div className="space-y-2">
                <div className="bg-accent p-3 rounded">
                  <p className="font-medium">Watersports Package</p>
                  <p className="text-sm text-gray-600">Group Discounts Available</p>
                </div>
                <div className="bg-accent p-3 rounded">
                  <p className="font-medium">Equipment Rental</p>
                  <p className="text-sm text-gray-600">Weekly Rates Available</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Index;