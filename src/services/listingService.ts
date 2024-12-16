import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { formatCategoryName } from "@/utils/csvParser";

export const saveCategory = async (category: { id: string; name: string; icon: string }) => {
  try {
    // First check if category exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('*')
      .eq('id', category.id)
      .single();

    if (existingCategory) {
      console.log(`Category ${category.name} already exists, skipping...`);
      return true;
    }

    // If category doesn't exist, insert it
    const { error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) {
      console.error("Error saving category:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in saveCategory:", error);
    return false;
  }
};

export const saveCategories = async (categories: Set<string>) => {
  console.log("Saving categories:", categories);
  const categoryObjects = Array.from(categories)
    .filter(cat => cat)
    .map(cat => ({
      id: cat,
      name: formatCategoryName(cat),
      icon: '🏠'
    }));

  const results = await Promise.all(
    categoryObjects.map(category => saveCategory(category))
  );

  return categoryObjects;
};

export const checkDuplicateListing = async (name: string) => {
  if (!name) {
    console.log("No name provided for duplicate check");
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('listings')
      .select('id')
      .eq('name', name)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking for duplicate listing:", error);
      return false;
    }

    return data !== null;
  } catch (error) {
    console.error("Error in checkDuplicateListing:", error);
    return false;
  }
};

export const saveListing = async (listingData: any, action: 'create' | 'merge' | 'ignore' = 'create') => {
  try {
    if (!listingData.name) {
      console.error("Listing name is required");
      return null;
    }

    // Create a clean listing object with only the fields that exist in the database
    const cleanListingData = {
      name: listingData.name,
      category: listingData.category,
      display_category: listingData.display_category,
      rating: listingData.rating,
      total_reviews: listingData.total_reviews,
      price_level: listingData.price_level,
      languages: listingData.languages,
      phone: listingData.phone,
      website: listingData.website,
      address: listingData.address,
      country: listingData.country,
      postal_code: listingData.postal_code,
      area: listingData.area,
      description: listingData.description,
      amenities: listingData.amenities,
      images: listingData.images,
      latitude: listingData.latitude,
      longitude: listingData.longitude,
      opening_hours: listingData.opening_hours,
      price_range: listingData.price_range,
      status: 'active'
    };

    const { data, error } = await supabase
      .from('listings')
      .insert([cleanListingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in saveListing:", error);
    throw error;
  }
};