import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations";

interface Category {
  id: string;
  name: string;
  icon: string;
  listingCount?: number;
  translations?: Record<string, string>;
}

interface NavigationProps {
  onCategoryChange?: (category: string | null) => void;
  selectedCategory: string | null;
  additionalCategories?: { id: string; name: string; icon?: string }[];
}

export const Navigation = ({ onCategoryChange, selectedCategory, additionalCategories = [] }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);

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

  const handleCategoryClick = (categoryId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
    }
    
    if (categoryId === "all") {
      onCategoryChange?.(null);
    } else if (selectedCategory === categoryId) {
      onCategoryChange?.(null);
    } else {
      onCategoryChange?.(categoryId);
    }
  };

  const visibleCategories = showAllCategories 
    ? categories 
    : [{ id: "all", name: "Alle categorieën", icon: "🏠" }, ...categories.slice(0, 6)];

  return (
    <nav className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex justify-center">
            <div className="flex space-x-2 md:space-x-4 overflow-x-auto scrollbar-hide pb-2 px-2 md:px-0 max-h-[calc(100vh-4rem)]">
              {visibleCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                    (category.id === "all" && !selectedCategory) || selectedCategory === category.id
                      ? "bg-gradient-caribbean text-white shadow-lg transform scale-105"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <span className="hidden md:inline">{category.icon}</span>
                  <span className="text-xs md:text-sm">
                    {category.translations?.[language] || category.name}
                  </span>
                </button>
              ))}
              
              {categories.length > 6 && (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                >
                  <span className="text-xs md:text-sm">
                    {showAllCategories ? t("showLess") : t("showMore")}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};