import { useState } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilters } from "@/components/CategoryFilters";
import { BusinessGrid } from "@/components/BusinessGrid";
import { CsvUploader } from "@/components/CsvUploader";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [additionalListings, setAdditionalListings] = useState<any[]>([]);
  const [additionalCategories, setAdditionalCategories] = useState<{ id: string; name: string }[]>([]);

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SearchBar />
        <CsvUploader 
          onUpload={handleCsvUpload}
          onNewCategories={handleNewCategories}
        />
        <CategoryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          additionalCategories={additionalCategories}
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