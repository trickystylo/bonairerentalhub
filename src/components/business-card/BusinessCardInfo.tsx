import { Star } from "lucide-react";
import { Business } from "../types/business";

interface BusinessCardInfoProps {
  business: Business;
}

export const BusinessCardInfo = ({ business }: BusinessCardInfoProps) => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-5 h-5 text-yellow-400" />
        <span className="font-medium">{business.rating}</span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-600">
          {"€".repeat(business.priceLevel)}
        </span>
        <span className="text-gray-400">•</span>
        <span className="text-sm text-gray-600">{business.displayCategory}</span>
      </div>

      <div className="flex items-start gap-2 mb-2">
        <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
        <p className="text-sm text-gray-600 line-clamp-2">{business.address}</p>
      </div>
    </div>
  );
};