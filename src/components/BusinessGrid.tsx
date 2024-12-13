import { BusinessCard } from "./BusinessCard";

const defaultBusinesses = [
  {
    id: "ChIJK-Gnjhsbg44RJEekxaPHWZQ",
    name: "Pickup Huren Bonaire",
    category: "auto",
    displayCategory: "Autoverhuur",
    rating: 4.9,
    priceLevel: 2,
    languages: ["NL", "EN"],
    phone: "+5997877637",
    website: "https://pickuphurenbonaire.com/",
    address: "Kaya Saturnus, Kralendijk",
    location: {
      latitude: 12.1252203,
      longitude: -68.2861905
    }
  },
  {
    id: "ChIJ6RJTBwcbg44RotVAZssMFwQ",
    name: "Blue Bay Bonaire",
    category: "boot",
    displayCategory: "Botenverhuurbedrijf",
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
  },
  {
    id: "ChIJde23tDobg44Rcxd0So-OeRg",
    name: "Blou Blou Rental",
    category: "equipment",
    displayCategory: "Scooterverhuurbedrijf",
    rating: 5.0,
    priceLevel: 2,
    languages: ["NL", "EN"],
    phone: "+5997863410",
    website: "http://bloublou.rent/",
    address: "26 Kaya Grandi, Kralendijk",
    location: {
      latitude: 12.1512365,
      longitude: -68.2767243
    }
  },
  {
    id: "ChIJsS5-LbEbg44RIL0H7n_4EF4",
    name: "Sunrentals Bonaire",
    category: "vakantiehuizen",
    displayCategory: "Verhuurbedrijf voor vakantiehuizen",
    rating: 4.5,
    priceLevel: 2,
    languages: ["NL", "EN"],
    phone: "+5997176130",
    website: "https://www.sunrentalsbonaire.com/",
    address: "65 Kaya Grandi, Kralendijk",
    location: {
      latitude: 12.1544981,
      longitude: -68.2780311
    }
  },
  {
    id: "ChIJ7YWhsn0Zg44RSVATw_OD5iI",
    name: "Kas Bon Aire",
    category: "vakantiehuizen",
    displayCategory: "Vakantieappartement",
    rating: 4.8,
    priceLevel: 3,
    languages: ["NL", "EN"],
    phone: "+5997802929",
    website: "http://www.kasbonaire.nl/",
    address: "Kaya Zircon 4-6 Republiek, Kralendijk",
    location: {
      latitude: 12.1842353,
      longitude: -68.2781092
    }
  },
  {
    id: "ChIJu3p772AZg44RuXGQnnUMzjA",
    name: "Huisje Huren Bonaire",
    category: "vakantiehuizen",
    displayCategory: "Verhuurbedrijf voor vakantiehuizen",
    rating: 5.0,
    priceLevel: 2,
    languages: ["NL", "EN"],
    phone: "+31641744614",
    website: "https://www.huisjehurenbonaire.nl/",
    address: "Bona Bista Estate, A-46, Kralendijk",
    location: {
      latitude: 12.1835098,
      longitude: -68.2643084
    }
  },
  {
    id: "ChIJy9MLaBkbg44RfRaqthKD5x4",
    name: "Sunwise Bonaire",
    category: "vakantiehuizen",
    displayCategory: "Verhuurbedrijf voor vakantiehuizen",
    rating: 4.9,
    priceLevel: 3,
    languages: ["NL", "EN"],
    phone: "+5997827100",
    website: "https://sunwisebonaire.com/",
    address: "83 Sabal Palm, Kralendijk",
    location: {
      latitude: 12.1216808,
      longitude: -68.2786293
    }
  },
  {
    id: "ChIJ4Sx66Nwbg44RUxvBdQ71eUk",
    name: "Aqua Fun Bonaire",
    category: "watersport",
    displayCategory: "Watersport verhuur",
    rating: 5.0,
    priceLevel: 2,
    languages: ["NL", "EN"],
    phone: "+5997858385",
    website: "https://www.aquafunbonaire.com/",
    address: "Harbour Village Bonaire, Kaya Gobernador Nicolas Debrot 71",
    location: {
      latitude: 12.1645154,
      longitude: -68.284359
    }
  }
];

interface BusinessGridProps {
  selectedCategory: string | null;
  additionalListings?: any[];
}

export const BusinessGrid = ({ selectedCategory, additionalListings = [] }: BusinessGridProps) => {
  // Combine default businesses with additional listings
  const allBusinesses = [...defaultBusinesses, ...additionalListings];
  
  // Filter businesses based on selected category
  const filteredBusinesses = selectedCategory
    ? allBusinesses.filter((business) => business.category === selectedCategory)
    : allBusinesses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
      {filteredBusinesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
};
