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
  },
  {
    id: "ChIJK-Gnjhsbg44RJEekxaPHWZQ",
    name: "Pickup Huren Bonaire",
    category: "Autoverhuur",
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
    id: "ChIJsS5-LbEbg44RIL0H7n_4EF4",
    name: "Sunrentals Bonaire",
    category: "Verhuurbedrijf voor vakantiehuizen",
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
    category: "Vakantieappartement",
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
    id: "ChIJc8D0Xiwag44RbUzwHxcZ-jE",
    name: "Qvillas",
    category: "Makelaardij",
    rating: 4.9,
    priceLevel: 3,
    languages: ["NL", "EN"],
    phone: "+5997170881",
    website: "http://www.qvillas.com/",
    address: "14 Kaya Gob. N. Debrot, Kralendijk",
    location: {
      latitude: 12.1588855,
      longitude: -68.2798077
    }
  },
  {
    id: "ChIJ45xMPsgbg44RuXAOEf4JgR0",
    name: "Bonaire Village",
    category: "Vakantieappartement",
    rating: 4.4,
    priceLevel: 2,
    languages: ["NL", "EN"],
    phone: "+31508200955",
    website: "https://www.bonairevillage.nl/",
    address: "14 Kaya Sirena, Kralendijk",
    location: {
      latitude: 12.1615249,
      longitude: -68.2765501
    }
  },
  {
    id: "ChIJde23tDobg44Rcxd0So-OeRg",
    name: "Blou Blou Rental",
    category: "Scooterverhuurbedrijf",
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