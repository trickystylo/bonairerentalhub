import { Star } from "lucide-react";
import { Business } from "../types/business";

interface BusinessCardImageProps {
  business: Business;
  isAdmin: boolean;
  isStarred: boolean;
  onToggleFeatured: (e: React.MouseEvent) => void;
}

export const BusinessCardImage = ({ 
  business, 
  isAdmin, 
  isStarred, 
  onToggleFeatured 
}: BusinessCardImageProps) => {
  return (
    <div className="relative">
      {business.images && business.images.length > 0 ? (
        <div className="relative h-48">
          <img
            src={business.images[0]}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-xl">{business.name}</h3>
                <p className="text-sm opacity-90">{business.displayCategory}</p>
              </div>
              {isAdmin && (
                <button
                  onClick={onToggleFeatured}
                  className={`p-2 rounded-full transition-colors ${
                    isStarred 
                      ? 'bg-yellow-400 text-yellow-900' 
                      : 'bg-gray-200/20 text-gray-200 hover:bg-gray-200/40'
                  }`}
                >
                  <Star className="w-5 h-5" fill={isStarred ? "currentColor" : "none"} />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-caribbean flex items-center justify-center p-6">
          <h3 className="font-semibold text-xl text-white text-center">{business.name}</h3>
        </div>
      )}
    </div>
  );
};