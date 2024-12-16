import { useEffect, useState } from "react";
import { getFeaturedListings } from "@/services/listingService";
import { BusinessCard } from "./BusinessCard";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations";

export const FeaturedListings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  const t = useTranslation(language);

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
        <span className="text-lg text-gray-500">{t("loading")}</span>
      </div>
    );
  }

  if (listings.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mb-12">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-caribbean bg-clip-text text-transparent">
        {t("featuredListings")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gradient-to-r from-accent/30 to-secondary/30 p-6 rounded-xl">
        {listings.map((listing) => (
          <BusinessCard key={listing.id} business={listing} />
        ))}
      </div>
    </div>
  );
};