import { useParams, useNavigate, Link } from "react-router-dom";
import { MapPin, Phone, Star, Globe, MessageSquare, Home, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations";

interface Business {
  id: string;
  name: string;
  category: string;
  displayCategory: string;
  rating: number;
  priceLevel: number;
  languages: string[];
  phone?: string;
  website?: string;
  address: string;
  description?: string;
  amenities?: string[];
  images?: string[];
  location: {
    latitude: number;
    longitude: number;
  };
}

const ListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Business | null>(null);
  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    const historyListing = window.history.state?.usr;
    
    if (historyListing) {
      setListing(historyListing);
      sessionStorage.setItem(`listing-${id}`, JSON.stringify(historyListing));
    } else {
      const storedListing = sessionStorage.getItem(`listing-${id}`);
      if (storedListing) {
        setListing(JSON.parse(storedListing));
      }
    }
  }, [id]);

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">{t("listingNotFound")}</p>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            {t("returnHome")}
          </Link>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const phoneNumber = listing.phone?.replace(/[^0-9]/g, '') || '';
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${listing.phone}`;
  };

  const handleMap = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.name)}&query_place_id=${listing.id}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t("back")}</span>
            </button>
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Home className="w-5 h-5" />
              <span>{t("home")}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {listing.images && listing.images.length > 0 && (
            <div className="h-[400px] w-full bg-gray-200">
              <img
                src={listing.images[0]}
                alt={listing.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-2">{listing.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{t(listing.category as TranslationKey)}</p>
            
            <div className="flex items-center mb-6">
              <Star className="w-5 h-5 text-secondary mr-1" />
              <span className="text-lg font-semibold">{listing.rating}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-gray-600">
                {"€".repeat(listing.priceLevel)}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{t("languages")}</h2>
              <div className="flex flex-wrap gap-2">
                {listing.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {listing.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">{t("description")}</h2>
                <p className="text-gray-700">{listing.description}</p>
              </div>
            )}

            {listing.amenities && listing.amenities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">{t("amenities")}</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((amenity: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">{t("address")}</h3>
                  <span className="text-gray-700">{listing.address}</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Phone className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">{t("phone")}</h3>
                  <span className="text-gray-700">{listing.phone}</span>
                </div>
              </div>

              {listing.website && (
                <div className="flex items-start space-x-2">
                  <Globe className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">{t("website")}</h3>
                    <a
                      href={listing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {t("visitWebsite")}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center space-x-2 bg-[#25D366] text-white rounded-lg py-3 hover:bg-opacity-90 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp</span>
              </button>
              
              <button
                onClick={handleCall}
                className="flex-1 flex items-center justify-center space-x-2 bg-primary text-white rounded-lg py-3 hover:bg-opacity-90 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{t("call")}</span>
              </button>
              
              <button
                onClick={handleMap}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 rounded-lg py-3 hover:bg-gray-200 transition-colors"
              >
                <MapPin className="w-5 h-5" />
                <span>{t("map")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;