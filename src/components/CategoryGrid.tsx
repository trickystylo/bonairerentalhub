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

const getCategoryIcon = (categoryId: string) => {
  const iconMap: Record<string, string> = {
    'fietsverhuur': '🚲',
    'scooterverhuur': '🛵',
    'auto': '🚗',
    'boot': '⛵',
    'watersport': '🏄‍♂️',
    'vakantiehuizen': '🏠',
    'equipment': '🎥',
    'all': '🏠'
  };
  return iconMap[categoryId] || '🏠';
};

export const CategoryGrid = ({ onCategorySelect, selectedCategory }: CategoryGridProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCategoriesWithCount = async () => {
      try {
        console.log("Starting to fetch categories and counts...");
        
        const { data: listings, error: listingsError } = await supabase
          .from('listings')
          .select('category, display_category')
          .not('category', 'is', null);

        if (listingsError) {
          console.error("Error fetching listings:", listingsError);
          return;
        }

        console.log("Raw listings data:", listings);

        const categoryMap = new Map<string, { count: number; name: string }>();
        
        listings?.forEach(listing => {
          if (listing.category && listing.display_category) {
            if (categoryMap.has(listing.category)) {
              const current = categoryMap.get(listing.category)!;
              categoryMap.set(listing.category, {
                count: current.count + 1,
                name: listing.display_category
              });
            } else {
              categoryMap.set(listing.category, {
                count: 1,
                name: listing.display_category
              });
            }
          }
        });

        console.log("Category map:", categoryMap);

        const allCategory = {
          id: 'all',
          name: 'Alle categorieën',
          icon: getCategoryIcon('all'),
          listingCount: listings?.length || 0
        };

        const categoriesArray = Array.from(categoryMap.entries()).map(([id, data]) => ({
          id,
          name: data.name,
          icon: getCategoryIcon(id),
          listingCount: data.count
        }));

        const sortedCategories = categoriesArray
          .sort((a, b) => (b.listingCount || 0) - (a.listingCount || 0));

        console.log("Final categories array:", [allCategory, ...sortedCategories]);
        
        setCategories([allCategory, ...sortedCategories]);
      } catch (error) {
        console.error("Error in fetchCategoriesWithCount:", error);
      }
    };

    fetchCategoriesWithCount();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    const newCategory = categoryId === selectedCategory ? null : categoryId;
    onCategorySelect(newCategory);
    // Store selected category in sessionStorage
    if (newCategory) {
      sessionStorage.setItem('selectedCategory', newCategory);
    } else {
      sessionStorage.removeItem('selectedCategory');
    }
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
              <div className="mb-2 text-3xl">
                {category.icon}
              </div>
              <div>
                <h3 className="font-medium text-base text-gray-900 break-words line-clamp-2 min-h-[2.5rem]">
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