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
      console.error('No website URL provided');
      return;
    }

    try {
      // Track the click first
      await trackListingClick(business.id, 'website');
      
      // Clean and prepare the URL
      let websiteUrl = business.website.trim();
      console.log('Original website URL:', websiteUrl);

      // If URL doesn't start with http:// or https://, add https://
      if (!websiteUrl.match(/^https?:\/\//i)) {
        websiteUrl = `https://${websiteUrl}`;
      }
      console.log('Final URL:', websiteUrl);

      // Validate URL format
      try {
        new URL(websiteUrl);
      } catch (error) {
        console.error('Invalid URL format:', error);
        throw new Error('Invalid URL format');
      }

      // Open URL in new tab with security attributes
      window.open(websiteUrl, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('Error opening website:', error);
      toast({
        title: "Error",
        description: "Could not open website. Please try again later.",
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