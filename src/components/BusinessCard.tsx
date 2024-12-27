import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Business } from "./types/business";
import { BusinessCardImage } from "./business-card/BusinessCardImage";
import { BusinessCardInfo } from "./business-card/BusinessCardInfo";
import { BusinessCardActions } from "./business-card/BusinessCardActions";
import { toggleFeaturedListing } from "@/services/listingService";
import { toast } from "./ui/use-toast";

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard = ({ business }: BusinessCardProps) => {
  const [isStarred, setIsStarred] = useState(business.is_premium);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        setIsAdmin(!!adminData);
      }
    };
    checkAdminStatus();
  }, []);

  const handleCardClick = () => {
    navigate(`/listing/${business.id}`, { state: business });
  };

  const handleToggleFeatured = async (e: React.MouseEvent) => {
    if (!isAdmin) return;
    e.stopPropagation();
    try {
      setIsStarred(!isStarred); // Immediate UI update
      await toggleFeaturedListing(business.id, !isStarred);
      toast({
        title: isStarred ? "Removed from featured" : "Added to featured",
        description: `${business.name} has been ${isStarred ? 'removed from' : 'added to'} featured listings.`,
      });
    } catch (error) {
      setIsStarred(!isStarred); // Revert on error
      console.error("Error toggling featured status:", error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
      onClick={handleCardClick}
    >
      <BusinessCardImage 
        business={business}
        isAdmin={isAdmin}
        isStarred={isStarred}
        onToggleFeatured={handleToggleFeatured}
      />
      <BusinessCardInfo business={business} />
      <BusinessCardActions 
        business={business}
        onStopPropagation={handleStopPropagation}
      />
    </div>
  );
};