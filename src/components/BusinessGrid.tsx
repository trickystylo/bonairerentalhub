import { BusinessCard } from "./BusinessCard";

const mockBusinesses = [
  {
    name: "ABC Car Rental",
    category: "Auto verhuur",
    rating: 4.5,
    priceLevel: 2,
    languages: ["NL", "EN", "DE"],
  },
  {
    name: "Blue Bay Boats",
    category: "Boot verhuur",
    rating: 4.8,
    priceLevel: 3,
    languages: ["NL", "EN"],
  },
  {
    name: "Sunny Dive Gear",
    category: "Equipment verhuur",
    rating: 4.2,
    priceLevel: 1,
    languages: ["NL", "EN", "ES"],
  },
];

export const BusinessGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
      {mockBusinesses.map((business) => (
        <BusinessCard key={business.name} business={business} />
      ))}
    </div>
  );
};