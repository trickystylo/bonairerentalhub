import { useState } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilters } from "@/components/CategoryFilters";
import { BusinessGrid } from "@/components/BusinessGrid";
import { CsvUploader } from "@/components/CsvUploader";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [additionalListings, setAdditionalListings] = useState<any[]>([]);

  const handleCsvUpload = (data: any[]) => {
    setAdditionalListings(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SearchBar />
        <CsvUploader onUpload={handleCsvUpload} />
        <CategoryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
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