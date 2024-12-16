import { useEffect, useState } from "react";
import { BusinessCard } from "./BusinessCard";
import { supabase } from "@/integrations/supabase/client";

interface BusinessGridProps {
  selectedCategory: string | null;
  additionalListings?: any[];
}

export const BusinessGrid = ({ selectedCategory, additionalListings = [] }: BusinessGridProps) => {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        let query = supabase.from('listings').select('*');
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
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
  }, [selectedCategory]);

  // Combine fetched listings with additional listings
  const allBusinesses = [...listings, ...additionalListings];
  
  // Filter businesses based on selected category
  const filteredBusinesses = selectedCategory
    ? allBusinesses.filter((business) => business.category === selectedCategory)
    : allBusinesses;

  console.log("All businesses:", allBusinesses);
  console.log("Filtered businesses:", filteredBusinesses);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-lg text-gray-500">Loading listings...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
      {filteredBusinesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
};