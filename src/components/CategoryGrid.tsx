import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  icon: string;
  listingCount?: number;
}

interface CategoryGridProps {
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}

export const CategoryGrid = ({ onCategorySelect, selectedCategory }: CategoryGridProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCategoriesWithCount = async () => {
      const { data: listings } = await supabase
        .from('listings')
        .select('category');

      const categoryCount = listings?.reduce((acc: Record<string, number>, listing) => {
        acc[listing.category] = (acc[listing.category] || 0) + 1;
        return acc;
      }, {});

      const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categories) {
        const categoriesWithCount = categories.map(cat => ({
          ...cat,
          listingCount: categoryCount?.[cat.id] || 0
        }));

        // Filter out empty categories and sort by listing count
        const nonEmptyCategories = categoriesWithCount
          .filter(cat => cat.listingCount > 0)
          .sort((a, b) => (b.listingCount || 0) - (a.listingCount || 0));

        setCategories(nonEmptyCategories);
      }
    };

    fetchCategoriesWithCount();
  }, []);

  const visibleCategories = showAll ? categories : categories.slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id === selectedCategory ? null : category.id)}
            className={`group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-100 border border-gray-200 transition-all duration-300 ${
              selectedCategory === category.id
                ? "ring-2 ring-primary shadow-lg transform scale-105"
                : "hover:shadow-lg hover:scale-[1.02]"
            }`}
          >
            <div className="aspect-[4/3] relative p-6 flex flex-col justify-between">
              <div className="text-4xl mb-2">{category.icon}</div>
              <div>
                <h3 className="font-medium text-lg text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.listingCount} listings</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {categories.length > 6 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-caribbean text-white hover:opacity-90 transition-opacity"
          >
            {showAll ? "Show Less" : "Show More Categories"}
          </button>
        </div>
      )}
    </div>
  );
};