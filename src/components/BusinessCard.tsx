import { MapPin, Phone, Star, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation, TranslationKey } from "../translations";

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

  const handleCardClick = () => {
    navigate(`/listing/${business.id}`, { state: business });
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer transform hover:-translate-y-1"
      onClick={handleCardClick}
    >
      {business.images && business.images.length > 0 && (
        <div className="h-48 w-full mb-4 rounded-lg overflow-hidden">
          <img
            src={business.images[0]}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <h3 className="font-semibold text-xl mb-2">{business.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{t(business.category as TranslationKey)}</p>
      
      <div className="flex items-center mb-4">
        <Star className="w-4 h-4 text-secondary mr-1" />
        <span className="text-sm font-medium">{business.rating}</span>
        <span className="mx-2 text-gray-300">•</span>
        <span className="text-sm text-gray-600">
          {"€".repeat(business.priceLevel)}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {business.languages.map((lang) => (
          <span
            key={lang}
            className="text-xs px-2 py-1 bg-gray-100 rounded-full"
          >
            {lang}
          </span>
        ))}
      </div>

      <div className="flex space-x-2">
        <button 
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center space-x-1 bg-[#25D366] text-white rounded-lg py-2 hover:bg-opacity-90 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm">WhatsApp</span>
        </button>
        <button 
          onClick={handleCall}
          className="flex-1 flex items-center justify-center space-x-1 bg-primary text-white rounded-lg py-2 hover:bg-opacity-90 transition-colors"
        >
          <Phone className="w-4 h-4" />
          <span className="text-sm">{t("call")}</span>
        </button>
        <button 
          onClick={handleMap}
          className="flex-1 flex items-center justify-center space-x-1 bg-gray-100 text-gray-700 rounded-lg py-2 hover:bg-gray-200 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{t("map")}</span>
        </button>
      </div>
    </div>
  );
};