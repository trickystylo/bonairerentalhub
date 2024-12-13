import { MapPin, Phone, Star, MessageSquare, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard = ({ business }: BusinessCardProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslation(language);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phoneNumber = business.phone?.replace(/[^0-9]/g, '') || '';
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${business.phone}`;
  };

  const handleMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name)}&query_place_id=${business.id}`;
    window.open(mapsUrl, '_blank');
  };

  const handleWebsite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (business.website) {
      window.open(business.website, '_blank');
    }
  };

  const handleCardClick = () => {
    navigate(`/listing/${business.id}`, { state: business });
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
      onClick={handleCardClick}
    >
      {business.images && business.images.length > 0 ? (
        <div className="relative h-48">
          <img
            src={business.images[0]}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-semibold text-xl">{business.name}</h3>
            <p className="text-sm opacity-90">{t(business.category)}</p>
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-caribbean flex items-center justify-center p-6">
          <h3 className="font-semibold text-xl text-white text-center">{business.name}</h3>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="font-medium">{business.rating}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">
            {"€".repeat(business.priceLevel)}
          </span>
        </div>

        <div className="flex items-start gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-2">{business.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button 
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-1 bg-[#25D366] text-white rounded-lg py-2 px-3 hover:bg-opacity-90 transition-colors text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
          <button 
            onClick={handleCall}
            className="flex items-center justify-center gap-1 bg-primary text-white rounded-lg py-2 px-3 hover:bg-opacity-90 transition-colors text-sm"
          >
            <Phone className="w-4 h-4" />
            <span>{t("call")}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <button 
            onClick={handleMap}
            className="flex items-center justify-center gap-1 bg-gray-100 text-gray-700 rounded-lg py-2 px-3 hover:bg-gray-200 transition-colors text-sm"
          >
            <MapPin className="w-4 h-4" />
            <span>{t("map")}</span>
          </button>
          {business.website && (
            <button 
              onClick={handleWebsite}
              className="flex items-center justify-center gap-1 bg-secondary text-white rounded-lg py-2 px-3 hover:bg-opacity-90 transition-colors text-sm"
            >
              <Link className="w-4 h-4" />
              <span>{t("website")}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};