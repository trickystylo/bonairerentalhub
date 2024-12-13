import { useRef } from "react";

const categories = [
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
}

export const CategoryFilters = ({ selectedCategory, onCategoryChange }: CategoryFiltersProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

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
      <div
        ref={scrollRef}
        className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        {categories.map((category) => (
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
    </div>
  );
};