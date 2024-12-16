import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { formatCategoryName, parseAmenities } from "@/utils/csvParser";

export const saveCategory = async (category: { id: string; name: string; icon: string }) => {
  try {
    console.log("Attempting to save category:", category);
    
    // First check if category exists using maybeSingle() instead of single()
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', category.id)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking existing category:", checkError);
      return false;
    }

    if (existingCategory) {
      console.log(`Category ${category.name} already exists, skipping...`);
      return true;
    }

    // If category doesn't exist, insert it
    const { error: insertError } = await supabase
      .from('categories')
      .insert(category);
    
    if (insertError) {
      console.error("Error saving category:", insertError);
      return false;
    }
    
    console.log(`Successfully saved category: ${category.name}`);
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
      id: cat.toLowerCase(),
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

    const isDuplicate = await checkDuplicateListing(listingData.name);
    if (isDuplicate && action === 'create') {
      console.log(`Skipping duplicate listing: ${listingData.name}`);
      return null;
    }

    // Map CSV fields to database columns
    const cleanListingData = {
      name: listingData.name,
      category: listingData.category?.toLowerCase() || '',
      display_category: formatCategoryName(listingData.category) || '',
      rating: parseFloat(listingData.rating) || 0,
      total_reviews: parseInt(listingData.total_reviews) || 0,
      price_level: parseInt(listingData.price_level) || 2,
      languages: listingData.languages || ["NL", "EN", "PAP", "ES"],
      phone: listingData.phone || null,
      website: listingData.website || null,
      address: listingData.address || null,
      country: listingData.country || 'Bonaire',
      postal_code: listingData.postal_code || null,
      area: listingData.area || null,
      description: listingData.description || null,
      amenities: parseAmenities(listingData.amenities),
      images: listingData.images || null,
      latitude: parseFloat(listingData.latitude) || null,
      longitude: parseFloat(listingData.longitude) || null,
      opening_hours: listingData.opening_hours || null,
      price_range: listingData.price_range || null,
      status: 'active'
    };

    console.log("Cleaned listing data:", cleanListingData);

    // Insert the listing and return all columns
    const { data, error } = await supabase
      .from('listings')
      .insert([cleanListingData])
      .select()
      .single();

    if (error) throw error;
    console.log("Successfully saved listing:", data);
    return data;
  } catch (error) {
    console.error("Error in saveListing:", error);
    throw error;
  }
};