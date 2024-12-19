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
      try {
        console.log("Starting to fetch categories and counts...");
        
        // First get all listings to count by category
        const { data: listings, error: listingsError } = await supabase
          .from('listings')
          .select('category');

        if (listingsError) {
          console.error("Error fetching listings:", listingsError);
          return;
        }

        console.log("Raw listings data:", listings);

        // Create category count map
        const categoryCount: Record<string, number> = {};
        listings?.forEach(listing => {
          if (listing.category) {
            categoryCount[listing.category] = (categoryCount[listing.category] || 0) + 1;
          }
        });

        console.log("Category counts:", categoryCount);

        // Then fetch all categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true })
          .order('name');

        if (categoriesError) {
          console.error("Error fetching categories:", categoriesError);
          return;
        }

        console.log("Raw categories data:", categoriesData);

        if (categoriesData) {
          // Create the "All categories" option
          const allCategory = {
            id: 'all',
            name: 'Alle categorieën',
            icon: '🏠',
            listingCount: listings?.length || 0
          };

          // Map categories with their counts
          const categoriesWithCount = categoriesData.map(cat => ({
            ...cat,
            listingCount: categoryCount[cat.id] || 0
          }));

          // Filter out categories with no listings and sort by listing count
          const nonEmptyCategories = categoriesWithCount
            .filter(cat => cat.listingCount > 0)
            .sort((a, b) => (b.listingCount || 0) - (a.listingCount || 0));

          console.log("Processed categories before setting state:", [allCategory, ...nonEmptyCategories]);
          
          // Add "All categories" at the beginning
          setCategories([allCategory, ...nonEmptyCategories]);
        }
      } catch (error) {
        console.error("Error in fetchCategoriesWithCount:", error);
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
                  {category.listingCount} {category.listingCount === 1 ? 'advertentie' : 'advertenties'}
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
            {showAll ? "Toon minder" : "Toon meer categorieën"}
          </button>
        </div>
      )}
    </div>
  );
};