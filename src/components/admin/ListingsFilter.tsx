import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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
        .order('name');
      
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
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onCategoryChange(null)}
        >
          All
        </Button>
        {categories.length > 0 ? (
          categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No categories available</p>
        )}
      </div>
    </div>
  );
};