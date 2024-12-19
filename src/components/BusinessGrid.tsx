import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BusinessCard } from "./BusinessCard";
import { SearchFilters } from "./SearchBar";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations";

interface BusinessGridProps {
  selectedCategory: string | null;
  searchQuery: string;
  searchFilters: SearchFilters;
}

const ITEMS_PER_PAGE = 15;

export const BusinessGrid = ({ 
  selectedCategory, 
  searchQuery,
  searchFilters 
}: BusinessGridProps) => {
  const [listings, setListings] = useState<any[]>([]);
  const [displayedListings, setDisplayedListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        console.log("Fetching listings with query:", searchQuery, "and category:", selectedCategory);
        
        let query = supabase
          .from('listings')
          .select('*');

        // Handle category selection
        if (selectedCategory && selectedCategory !== "all") {
          query = query.eq('category', selectedCategory);
        }

        if (searchQuery) {
          const searchTerm = searchQuery.toLowerCase().trim();
          console.log("Processing search term:", searchTerm);

          // First, get all categories to check if search term matches any category
          const { data: categories } = await supabase
            .from('categories')
            .select('id, name');

          const matchingCategory = categories?.find(cat => 
            cat.name.toLowerCase().includes(searchTerm) || 
            cat.id.toLowerCase().includes(searchTerm)
          );

          if (matchingCategory) {
            console.log("Found matching category:", matchingCategory);
            // If search term matches a category, show all listings from that category
            query = query.eq('category', matchingCategory.id);
          } else {
            // Otherwise, search in listing names and descriptions
            // Using startsWith for name (ilike with % only at the end)
            // and contains for description (ilike with % at both ends)
            query = query.or(`
              name.ilike.${searchTerm}%,
              description.ilike.%${searchTerm}%,
              display_category.ilike.${searchTerm}%
            `);
          }
        }

        // Apply filters
        if (searchFilters.minRating > 0) {
          query = query.gte('rating', searchFilters.minRating);
        }

        if (searchFilters.priceRange[0] !== 1 || searchFilters.priceRange[1] !== 3) {
          query = query
            .gte('price_level', searchFilters.priceRange[0])
            .lte('price_level', searchFilters.priceRange[1]);
        }

        if (searchFilters.hasWebsite) {
          query = query.not('website', 'is', null);
        }

        if (searchFilters.hasPhone) {
          query = query.not('phone', 'is', null);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching listings:", error);
          return;
        }

        console.log("Fetched listings count:", data?.length);
        console.log("First few results:", data?.slice(0, 3));
        
        setListings(data || []);
        setDisplayedListings((data || []).slice(0, ITEMS_PER_PAGE));
        setPage(1);
      } catch (error) {
        console.error("Error in fetchListings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [selectedCategory, searchQuery, searchFilters]);

  const loadMore = () => {
    const nextPage = page + 1;
    const start = (nextPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setDisplayedListings(listings.slice(0, end));
    setPage(nextPage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-lg text-gray-500">{t("loading")}</span>
      </div>
    );
  }

  const hasMore = displayedListings.length < listings.length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto mt-8">
      {searchQuery && (
        <h2 className="text-2xl font-semibold text-gray-900 border-b pb-4">
          {t("searchResults")}
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedListings.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
      
      {listings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">{t("noResults")}</p>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            className="group"
          >
            {t("showMore")}
            <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
          </Button>
        </div>
      )}
    </div>
  );
};
