import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { CategoryFilters } from "@/components/CategoryFilters";
import { supabase } from "@/integrations/supabase/client";

interface ListingsFilterProps {
  onSearch: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const ListingsFilter = ({
  onSearch,
  selectedCategory,
  onCategoryChange,
}: ListingsFilterProps) => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      
      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-4 mb-6">
      <Input
        placeholder="Search listings..."
        onChange={(e) => onSearch(e.target.value)}
        className="max-w-md"
      />
      <CategoryFilters
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
    </div>
  );
};