import { useState, useEffect } from "react";

export const useListingsFilter = (initialListings: any[]) => {
  const [filteredListings, setFilteredListings] = useState(initialListings);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setFilteredListings(initialListings);
  }, [initialListings]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterListings(query, selectedCategory);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    filterListings(searchQuery, category);
  };

  const filterListings = (query: string, category: string | null) => {
    let filtered = initialListings;

    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(listing =>
        listing.name.toLowerCase().includes(lowercaseQuery) ||
        listing.display_category.toLowerCase().includes(lowercaseQuery)
      );
    }

    if (category) {
      filtered = filtered.filter(listing =>
        listing.category === category
      );
    }

    setFilteredListings(filtered);
  };

  return {
    filteredListings,
    selectedCategory,
    handleSearch,
    handleCategoryChange
  };
};