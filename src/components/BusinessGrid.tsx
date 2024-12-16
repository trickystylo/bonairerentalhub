import { useEffect, useState } from "react";
import { BusinessCard } from "./BusinessCard";
import { supabase } from "@/integrations/supabase/client";
import { SearchFilters } from "./SearchBar";

interface BusinessGridProps {
  selectedCategory: string | null;
  searchQuery: string;
  searchFilters: SearchFilters;
}

export const BusinessGrid = ({ 
  selectedCategory, 
  searchQuery,
  searchFilters 
}: BusinessGridProps) => {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        
        console.log("Fetched listings:", data);
        setListings(data || []);
      } catch (error) {
        console.error("Error in fetchListings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [selectedCategory, searchQuery, searchFilters]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-lg text-gray-500">Loading listings...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
      {listings.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
      {listings.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-lg text-gray-500">No listings found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};