import { supabase } from "@/integrations/supabase/client";

export const checkDuplicateListing = async (name: string) => {
  if (!name) {
    console.log("No name provided for duplicate check");
    return false;
  }

  try {
    console.log(`Checking for duplicate listing with name: ${name}`);
    const { data, error } = await supabase
      .from('listings')
      .select('id')
      .eq('name', name)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking for duplicate listing:", error);
      // Instead of throwing error, return false to allow the operation to continue
      return false;
    }

    return data !== null;
  } catch (error) {
    console.error("Error in checkDuplicateListing:", error);
    // Return false instead of throwing error to allow the operation to continue
    return false;
  }
};

export const saveListing = async (listingData: any, action: 'create' | 'merge' | 'ignore' = 'create') => {
  try {
    console.log("Attempting to save listing:", listingData);

    if (!listingData.name) {
      console.error("Listing name is required");
      return null;
    }

    const isDuplicate = await checkDuplicateListing(listingData.name);
    if (isDuplicate && action === 'create') {
      console.log(`Skipping duplicate listing: ${listingData.name}`);
      return null;
    }

    const cleanListingData = {
      name: listingData.name,
      category: listingData.category?.toLowerCase() || '',
      display_category: listingData.display_category || '',
      rating: parseFloat(listingData.rating) || 0,
      total_reviews: parseInt(listingData.total_reviews) || 0,
      total_score: parseFloat(listingData.totalScore) || null,
      reviews_count: parseInt(listingData.reviewsCount) || null,
      price_level: parseInt(listingData.price_level) || 2,
      languages: listingData.languages || ["NL", "EN", "PAP", "ES"],
      phone: listingData.phone || null,
      website: listingData.website || null,
      address: listingData.address || null,
      country: listingData.country || 'Bonaire',
      postal_code: listingData.postal_code || null,
      area: listingData.area || null,
      description: listingData.description || null,
      amenities: listingData.amenities || [],
      images: listingData.images || [],
      latitude: parseFloat(listingData.latitude) || null,
      longitude: parseFloat(listingData.longitude) || null,
      status: 'active'
    };

    console.log("Cleaned listing data:", cleanListingData);

    const { data, error } = await supabase
      .from('listings')
      .insert([cleanListingData])
      .select()
      .single();

    if (error) {
      console.error("Error saving listing:", error);
      throw error;
    }
    
    console.log("Successfully saved listing:", data);
    return data;
  } catch (error) {
    console.error("Error in saveListing:", error);
    throw error;
  }
};

export const toggleFeaturedListing = async (id: string, isFeatured: boolean) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .update({ is_premium: isFeatured })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error toggling featured status:", error);
    throw error;
  }
};

export const getFeaturedListings = async () => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('is_premium', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    throw error;
  }
};

export type ClickType = 'website' | 'phone' | 'whatsapp' | 'map' | 'call';

export const trackListingClick = async (listingId: string, clickType: ClickType) => {
  try {
    console.log(`Tracking click for listing ${listingId}, type: ${clickType}`);
    
    // Record the click
    const { error: clickError } = await supabase
      .from('listing_clicks')
      .insert([{ listing_id: listingId, click_type: clickType }]);

    if (clickError) {
      console.error("Error recording click:", clickError);
      throw clickError;
    }

    // Get current total_clicks
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('total_clicks')
      .eq('id', listingId)
      .single();

    if (fetchError) {
      console.error("Error fetching listing:", fetchError);
      throw fetchError;
    }

    // Increment total clicks
    const { error: updateError } = await supabase
      .from('listings')
      .update({ total_clicks: (listing?.total_clicks || 0) + 1 })
      .eq('id', listingId);

    if (updateError) {
      console.error("Error updating total clicks:", updateError);
      throw updateError;
    }

    console.log(`Successfully tracked click for listing ${listingId}`);

  } catch (error) {
    console.error("Error tracking click:", error);
    throw error;
  }
};

export const resetListingClicks = async (listingId: string) => {
  try {
    // Delete click records
    await supabase
      .from('listing_clicks')
      .delete()
      .eq('listing_id', listingId);

    // Reset total clicks counter
    await supabase
      .from('listings')
      .update({ total_clicks: 0 })
      .eq('id', listingId);

  } catch (error) {
    console.error("Error resetting clicks:", error);
    throw error;
  }
};
