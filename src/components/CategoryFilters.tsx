import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

interface Category {
  id: string;
  name: string;
}

const defaultCategories: Category[] = [
  { id: "all", name: "Alle categorieën" },
  { id: "auto", name: "Auto verhuur" },
  { id: "boot", name: "Boot verhuur" },
  { id: "watersport", name: "Watersport verhuur" },
  { id: "vakantiehuizen", name: "Vakantiehuizen" },
  { id: "equipment", name: "Equipment verhuur" },
];

interface CategoryFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  additionalCategories?: Category[];
}

export const CategoryFilters = ({ 
  selectedCategory, 
  onCategoryChange,
  additionalCategories = []
}: CategoryFiltersProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const allCategories = [...defaultCategories, ...additionalCategories];

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "all") {
      onCategoryChange(null);
    } else if (selectedCategory === categoryId) {
      onCategoryChange(null);
    } else {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto mt-4">
      {(!isHomePage || scrollRef.current?.scrollLeft > 0) && (
        <button 
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-10 hover:bg-white transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      
      <div
        ref={scrollRef}
        className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide px-10"
        onScroll={(e) => e.currentTarget.scrollLeft}
      >
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              (category.id === "all" && !selectedCategory) || selectedCategory === category.id
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <button 
        onClick={() => handleScroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-10 hover:bg-white transition-opacity"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};