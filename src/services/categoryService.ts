import { supabase } from "@/integrations/supabase/client";
import { formatCategoryName } from "@/utils/csvParser";

export const saveCategory = async (category: { id: string; name: string; icon: string }) => {
  try {
    console.log("Attempting to save category:", category);
    
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