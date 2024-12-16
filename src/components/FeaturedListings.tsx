import { useEffect, useState } from "react";
import { getFeaturedListings } from "@/services/listingService";
import { BusinessCard } from "./BusinessCard";

export const FeaturedListings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const data = await getFeaturedListings();
        setListings(data || []);
      } catch (error) {
        console.error("Error fetching featured listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedListings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-lg text-gray-500">Loading featured listings...</span>
      </div>
    );
  }

  if (listings.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mb-12">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-caribbean bg-clip-text text-transparent">
        Featured Listings
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <BusinessCard key={listing.id} business={listing} />
        ))}
      </div>
    </div>
  );
};