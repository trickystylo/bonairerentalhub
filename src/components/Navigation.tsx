import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations";

const defaultCategories = [
  { id: "all", name: "Alle categorieën", icon: "🏠" },
  { id: "auto", name: "Auto verhuur", icon: "🚗" },
  { id: "boot", name: "Boot verhuur", icon: "🚤" },
  { id: "watersport", name: "Watersport verhuur", icon: "🏄‍♂️" },
  { id: "vakantiehuizen", name: "Vakantiehuizen", icon: "🏡" },
  { id: "equipment", name: "Equipment verhuur", icon: "🛠" },
];

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
  
  const allCategories = [...defaultCategories, ...additionalCategories];

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

  return (
    <nav className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex justify-center">
            <div className="flex space-x-2 md:space-x-4 overflow-x-auto scrollbar-hide pb-2 px-2 md:px-0">
              {allCategories.map((category) => (
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
                  <span className="text-xs md:text-sm">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};