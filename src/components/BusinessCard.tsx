import { Star } from "lucide-react";

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    category: string;
    display_category: string;
    rating: number;
    reviews_count: number;
    image_url: string;
  };
}

export const BusinessCard = ({ business }: BusinessCardProps) => {
  return (
    <div className="group relative">
      <img
        src={business.image_url}
        alt={business.name}
        className="w-full h-48 object-cover rounded-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{business.name}</h3>
        <p className="text-sm text-gray-500">{business.display_category}</p>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {business.rating && business.reviews_count > 0 && (
            <>
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{business.rating}</span>
              <span className="text-gray-400">({business.reviews_count})</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
