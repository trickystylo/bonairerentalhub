import { MessageSquare, Phone, MapPin, Link } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "../../translations";
import { Business } from "../types/business";
import { trackListingClick } from "@/services/listingService";
import { toast } from "../ui/use-toast";

interface BusinessCardActionsProps {
  business: Business;
  onStopPropagation: (e: React.MouseEvent) => void;
}

export const BusinessCardActions = ({ business, onStopPropagation }: BusinessCardActionsProps) => {
  const { language } = useLanguage();
  const t = useTranslation(language);

  const handleWhatsApp = async (e: React.MouseEvent) => {
    onStopPropagation(e);
    if (!business.phone) return;
    
    await trackListingClick(business.id, 'whatsapp');
    const phoneNumber = business.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const handleCall = async (e: React.MouseEvent) => {
    onStopPropagation(e);
    if (!business.phone) return;
    
    await trackListingClick(business.id, 'phone');
    window.location.href = `tel:${business.phone}`;
  };

  const handleMap = async (e: React.MouseEvent) => {
    onStopPropagation(e);
    await trackListingClick(business.id, 'map');
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`;
    window.open(mapsUrl, '_blank');
  };

  const handleWebsite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!business.website) {
      console.log('No website URL provided');
      return;
    }

    try {
      await trackListingClick(business.id, 'website');
      
      // Clean and format the URL
      let websiteUrl = business.website.trim();
      
      // Add https:// if no protocol is specified
      if (!websiteUrl.match(/^https?:\/\//i)) {
        websiteUrl = `https://${websiteUrl}`;
      }
      
      console.log('Opening website URL:', websiteUrl);
      
      // Open in new tab with security attributes
      window.open(websiteUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening website:', error);
      toast({
        title: "Error",
        description: "Could not open website",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 pt-0">
      <div className="grid grid-cols-2 gap-2">
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
  );
};