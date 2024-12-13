import { MessageSquare, Phone, MapPin } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "../../translations";

interface ListingActionsProps {
  phone?: string;
  name: string;
  id: string;
}

export const ListingActions = ({ phone, name, id }: ListingActionsProps) => {
  const { language } = useLanguage();
  const t = useTranslation(language);

  const handleWhatsApp = () => {
    const phoneNumber = phone?.replace(/[^0-9]/g, '') || '';
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${phone}`;
  };

  const handleMap = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${id}`;
    window.open(mapsUrl, '_blank');
  };

  return (
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
  );
};