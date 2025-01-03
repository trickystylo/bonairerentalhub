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

// Helper function to normalize text for comparison
const normalizeText = (text: string) => {
  return text.toLowerCase()
    .replace(/\s+/g, '') // Remove spaces
    .normalize("NFD") // Normalize accents
    .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
};

// Helper function to split search query into words
const splitSearchQuery = (query: string): string[] => {
  return query.toLowerCase().trim().split(/\s+/);
};

// Helper function to calculate match score
const calculateMatchScore = (listing: any, searchTerms: string[]) => {
  const normalizedName = normalizeText(listing.name);
  const joinedSearchTerms = searchTerms.join('');
  const normalizedSearchTerm = normalizeText(joinedSearchTerms);

  // Exact match gets highest priority
  if (normalizedName === normalizedSearchTerm) {
    return 3;
  }
  
  // Starts with search term gets second priority
  if (normalizedName.startsWith(normalizedSearchTerm)) {
    return 2;
  }

  // Contains all search terms gets third priority
  if (searchTerms.every(term => normalizedName.includes(normalizeText(term)))) {
    return 1;
  }

  // No direct match
  return 0;
};

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
        console.log("Starting search with query:", searchQuery);
        console.log("Selected category:", selectedCategory);
        
        // Start with base query
        let query = supabase
          .from('listings')
          .select('*');

        // Handle category selection first
        if (selectedCategory && selectedCategory !== "all") {
          query = query.eq('category', selectedCategory);
        }

        // Only apply search filters if there's a search query
        if (searchQuery.trim()) {
          const searchTerms = splitSearchQuery(searchQuery);
          console.log("Search terms:", searchTerms);

          // First check if any search term matches any category
          const { data: categories } = await supabase
            .from('categories')
            .select('id, name');

          console.log("Available categories:", categories);

          // Look for category matches
          const matchingCategories = categories?.filter(cat => {
            const normalizedCatName = normalizeText(cat.name);
            const normalizedCatId = normalizeText(cat.id);
            return searchTerms.some(term => 
              normalizedCatName.includes(term) || 
              normalizedCatId.includes(term)
            );
          }) || [];

          if (matchingCategories.length > 0) {
            console.log("Found matching categories:", matchingCategories);
            // If search matches categories, show all listings from those categories
            const categoryIds = matchingCategories.map(cat => cat.id);
            query = query.in('category', categoryIds);
          } else {
            // If no category match, search in listings
            // Build the OR conditions for each search term
            const searchConditions = searchTerms.map(term => {
              const likePattern = `%${term}%`;
              return `name.ilike.${likePattern},description.ilike.${likePattern},category.ilike.${likePattern}`;
            }).join(',');

            query = query.or(searchConditions);
          }
        }

        // Apply additional filters
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

        let sortedData = data || [];
        if (searchQuery.trim()) {
          const searchTerms = splitSearchQuery(searchQuery);
          sortedData = sortedData.sort((a, b) => {
            const scoreA = calculateMatchScore(a, searchTerms);
            const scoreB = calculateMatchScore(b, searchTerms);
            return scoreB - scoreA;
          });
        } else {
          // If no search query, randomize the order
          sortedData = sortedData.sort(() => Math.random() - 0.5);
        }

        console.log("Search results count:", sortedData.length);
        console.log("First few results:", sortedData.slice(0, 3));
        
        setListings(sortedData);
        setDisplayedListings(sortedData.slice(0, ITEMS_PER_PAGE));
        setPage(1);
      } catch (error) {
        console.error("Error in fetchListings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchListings();
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
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
