import { useEffect, useState } from "react";
import { BusinessCard } from "./BusinessCard";
import { supabase } from "@/integrations/supabase/client";
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
        let query = supabase
          .from('listings')
          .select('*');
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }

        if (searchQuery) {
          query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

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
        <span className="text-lg text-gray-500">Loading listings...</span>
      </div>
    );
  }

  const hasMore = displayedListings.length < listings.length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto mt-8">
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