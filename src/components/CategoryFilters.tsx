import { useRef } from "react";

const categories = [
  { id: "auto", name: "Auto verhuur" },
  { id: "boot", name: "Boot verhuur" },
  { id: "watersport", name: "Watersport verhuur" },
  { id: "vakantiehuizen", name: "Vakantiehuizen" },
  { id: "equipment", name: "Equipment verhuur" },
];

export const CategoryFilters = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative max-w-6xl mx-auto mt-4">
      <div
        ref={scrollRef}
        className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            className="flex-shrink-0 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm whitespace-nowrap"
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};