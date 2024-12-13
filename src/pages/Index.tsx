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
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        additionalCategories={additionalCategories}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-caribbean bg-clip-text text-transparent">
            {t("welcomeMessage")}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {t("siteDescription")}
          </p>
        </div>
        
        <SearchBar />
        <CsvUploader 
          onUpload={handleCsvUpload}
          onNewCategories={handleNewCategories}
        />
        <BusinessGrid 
          selectedCategory={selectedCategory}
          additionalListings={additionalListings}
        />
      </main>
    </div>
  );
};

export default Index;