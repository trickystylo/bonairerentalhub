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
      console.log("Fetching categories and their listing counts...");
      
      // First get all listings to count by category
      const { data: listings } = await supabase
        .from('listings')
        .select('category');

      console.log("Fetched listings:", listings);

      const categoryCount = listings?.reduce((acc: Record<string, number>, listing) => {
        if (listing.category) {
          acc[listing.category] = (acc[listing.category] || 0) + 1;
        }
        return acc;
      }, {});

      console.log("Category counts:", categoryCount);

      // Then fetch all categories
      const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categories) {
        console.log("Fetched categories:", categories);
        
        // Create the "All categories" option
        const allCategory = {
          id: 'all',
          name: 'All categories',
          icon: '🏠',
          listingCount: listings?.length || 0
        };

        // Map categories with their counts and filter out empty ones
        const categoriesWithCount = categories.map(cat => ({
          ...cat,
          listingCount: categoryCount?.[cat.id] || 0
        }));

        // Filter out categories with no listings and sort by listing count
        const nonEmptyCategories = categoriesWithCount
          .filter(cat => cat.listingCount > 0)
          .sort((a, b) => (b.listingCount || 0) - (a.listingCount || 0));

        // Add "All categories" at the beginning
        const finalCategories = [allCategory, ...nonEmptyCategories];
        
        console.log("Processed categories:", finalCategories);
        setCategories(finalCategories);
      }
    };

    fetchCategoriesWithCount();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId === selectedCategory ? null : categoryId);
    // Scroll to search results
    const resultsElement = document.getElementById('search-results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const visibleCategories = showAll ? categories : categories.slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`group relative overflow-hidden rounded-lg bg-gradient-to-br from-white to-gray-100 border border-gray-200 transition-all duration-300 ${
              selectedCategory === category.id
                ? "ring-2 ring-primary shadow-lg transform scale-105"
                : "hover:shadow-lg hover:scale-[1.02]"
            }`}
          >
            <div className="aspect-[4/3] relative p-4 flex flex-col justify-between">
              <div className="text-3xl mb-2">{category.icon}</div>
              <div>
                <h3 className="font-medium text-base text-gray-900 line-clamp-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.listingCount} listings
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {categories.length > 4 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-caribbean text-white hover:opacity-90 transition-opacity text-sm"
          >
            {showAll ? "Show Less" : "Show More Categories"}
          </button>
        </div>
      )}
    </div>
  );
};