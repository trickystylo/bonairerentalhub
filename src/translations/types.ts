export type Language = 'NL' | 'EN' | 'PAP' | 'ES';

export type TranslationKey = 
  | 'allCategories' | 'back' | 'home' | 'amenities' | 'visitWebsite'
  | 'whatsapp' | 'call' | 'map' | 'listingNotFound' | 'returnHome'
  | 'rating' | 'languages' | 'address' | 'phone' | 'website'
  | 'description' | 'priceLevel' | 'auto' | 'boot' | 'watersport'
  | 'vakantiehuizen' | 'equipment' | 'hotel' | 'resort' | 'appartementen'
  | 'siteDescription' | 'welcomeMessage' | 'welcomeTitle' | 'welcomeDescription'
  | 'searchPlaceholder' | 'searchResults' | 'resetClicks' | 'clickStats'
  | 'loading' | 'noResults' | 'showMore' | 'showLess' | 'featuredListings'
  | 'categories' | 'featured' | 'about' | 'discoverTitle' | 'discoverDescription'
  | 'rentalDescription' | 'contact' | 'contactUs' | 'success' | 'requestSubmitted'
  | 'error' | 'errorSubmitting' | 'listingRequest' | 'advertisementRequest'
  | 'newListing' | 'editListing' | 'deleteListing' | 'topPosition'
  | 'sidebarPosition' | 'bottomPosition' | 'businessName' | 'contactName'
  | 'email' | 'message' | 'submitting' | 'submit' | 'cookieConsentText'
  | 'decline' | 'accept' | 'advertisementSpace' | 'clickToAdvertise'
  | 'websiteUrl';

export type TranslationDictionary = Record<TranslationKey, string>;