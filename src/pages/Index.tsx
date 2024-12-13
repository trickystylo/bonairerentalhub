import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilters } from "@/components/CategoryFilters";
import { BusinessGrid } from "@/components/BusinessGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SearchBar />
        <CategoryFilters />
        <BusinessGrid />
      </main>
    </div>
  );
};

export default Index;