export const translations = {
  NL: {
    allCategories: "Alle categorieën",
    back: "Terug",
    home: "Home",
    amenities: "Voorzieningen",
    visitWebsite: "Bezoek Website",
    whatsapp: "WhatsApp",
    call: "Bellen",
    map: "Kaart",
    listingNotFound: "Advertentie niet gevonden",
    returnHome: "Terug naar Home"
  },
  EN: {
    allCategories: "All categories",
    back: "Back",
    home: "Home",
    amenities: "Amenities",
    visitWebsite: "Visit Website",
    whatsapp: "WhatsApp",
    call: "Call",
    map: "Map",
    listingNotFound: "Listing not found",
    returnHome: "Return to Home"
  },
  PAP: {
    allCategories: "Tur kategoria",
    back: "Bèk",
    home: "Kas",
    amenities: "Fasilidatnan",
    visitWebsite: "Bishitá website",
    whatsapp: "WhatsApp",
    call: "Yama",
    map: "Mapa",
    listingNotFound: "Listing no ta encontrá",
    returnHome: "Bai bèk na kas"
  },
  ES: {
    allCategories: "Todas las categorías",
    back: "Volver",
    home: "Inicio",
    amenities: "Servicios",
    visitWebsite: "Visitar sitio web",
    whatsapp: "WhatsApp",
    call: "Llamar",
    map: "Mapa",
    listingNotFound: "Anuncio no encontrado",
    returnHome: "Volver a inicio"
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.EN;

export const useTranslation = (lang: Language) => {
  return (key: TranslationKey) => translations[lang][key];
};