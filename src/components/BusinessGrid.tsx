import { BusinessCard } from "./BusinessCard";

const businesses = [
  {
    id: "ChIJu3p772AZg44RuXGQnnUMzjA",
    name: "Huisje Huren Bonaire",
    category: "Verhuurbedrijf voor vakantiehuizen",
    rating: 5.0,
    priceLevel: 2,
    languages: ["NL", "EN"],
    phone: "+31641744614",
    website: "https://www.huisjehurenbonaire.nl/",
    address: "Bona Bista Estate, A-46, Kralendijk Bonaire",
    location: {
      latitude: 12.1835098,
      longitude: -68.2643084
    }
  },
  {
    id: "ChIJy9MLaBkbg44RfRaqthKD5x4",
    name: "Sunwise Bonaire",
    category: "Verhuurbedrijf voor vakantiehuizen",
    rating: 4.9,
    priceLevel: 3,
    languages: ["NL", "EN", "DE"],
    phone: "+5997827100",
    website: "https://sunwisebonaire.com/",
    address: "83 Sabal Palm, Kralendijk",
    location: {
      latitude: 12.1216808,
      longitude: -68.2786293
    }
  },
  {
    id: "ChIJ6RJTBwcbg44RotVAZssMFwQ",
    name: "Blue Bay Bonaire",
    category: "Botenverhuurbedrijf",
    rating: 4.8,
    priceLevel: 3,
    languages: ["NL", "EN"],
    phone: "+5997015500",
    website: "http://www.bluebaybonaire.com/",
    address: "Harbour Village marina Bonaire, Kralendijk",
    location: {
      latitude: 12.1643398,
      longitude: -68.2842142
    }
  }
];

export const BusinessGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
};