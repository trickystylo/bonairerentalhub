import { MapPin, Phone, Star, MessageSquare } from "lucide-react";

interface BusinessCardProps {
  business: {
    name: string;
    category: string;
    rating: number;
    priceLevel: number;
    languages: string[];
  };
}

export const BusinessCard = ({ business }: BusinessCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
      <h3 className="font-semibold text-lg mb-2">{business.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{business.category}</p>
      
      <div className="flex items-center mb-2">
        <Star className="w-4 h-4 text-secondary mr-1" />
        <span className="text-sm">{business.rating}</span>
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
        <button className="flex-1 flex items-center justify-center space-x-1 bg-[#25D366] text-white rounded-md py-2">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm">WhatsApp</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-1 bg-primary text-white rounded-md py-2">
          <Phone className="w-4 h-4" />
          <span className="text-sm">Call</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-1 bg-gray-100 text-gray-700 rounded-md py-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Map</span>
        </button>
      </div>
    </div>
  );
};