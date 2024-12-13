import { useParams } from "react-router-dom";
import { MapPin, Phone, Star, Globe, MessageSquare } from "lucide-react";

const ListingPage = () => {
  const { id } = useParams();
  // In a real app, you would fetch the listing data based on the ID
  // For now, we'll use window.history.state to get the data passed from BusinessCard
  const listing = window.history.state?.usr || null;

  if (!listing) {
    return <div>Listing not found</div>;
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
      <div className="max-w-6xl mx-auto px-4 py-8">
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
            <p className="text-lg text-gray-600 mb-4">{listing.displayCategory}</p>
            
            <div className="flex items-center mb-6">
              <Star className="w-5 h-5 text-secondary mr-1" />
              <span className="text-lg font-semibold">{listing.rating}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-gray-600">
                {"€".repeat(listing.priceLevel)}
              </span>
            </div>

            {listing.description && (
              <p className="text-gray-700 mb-6">{listing.description}</p>
            )}

            {listing.amenities && listing.amenities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((amenity: string) => (
                    <span
                      key={amenity}
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
                <span className="text-gray-700">{listing.address}</span>
              </div>
              
              <div className="flex items-start space-x-2">
                <Phone className="w-5 h-5 text-gray-500 mt-1" />
                <span className="text-gray-700">{listing.phone}</span>
              </div>

              {listing.website && (
                <div className="flex items-start space-x-2">
                  <Globe className="w-5 h-5 text-gray-500 mt-1" />
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Website
                  </a>
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
                <span>Call</span>
              </button>
              
              <button
                onClick={handleMap}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 rounded-lg py-3 hover:bg-gray-200 transition-colors"
              >
                <MapPin className="w-5 h-5" />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;