import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { formatCategoryName } from "@/utils/csvParser";

export const saveCategory = async (category: { id: string; name: string; icon: string }) => {
  try {
    const { error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error && error.code !== '23505') {
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
  const { data } = await supabase
    .from('listings')
    .select('name')
    .eq('name', name)
    .single();
    
  return data !== null;
};

export const saveListing = async (listingData: any, action: 'create' | 'merge' | 'ignore' = 'create') => {
  try {
    const isDuplicate = await checkDuplicateListing(listingData.name);
    
    if (isDuplicate) {
      console.log(`Skipping duplicate listing: ${listingData.name}`);
      toast({
        title: "Skipped Duplicate",
        description: `Listing "${listingData.name}" already exists and was skipped.`,
      });
      return null;
    }

    const { data, error } = await supabase
      .from('listings')
      .insert([listingData])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error in saveListing:", error);
    throw error;
  }
};