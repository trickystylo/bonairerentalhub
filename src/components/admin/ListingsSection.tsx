import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingsTable } from "./ListingsTable";
import { CsvUploader } from "@/components/CsvUploader";
import { DuplicateListingDialog } from "./DuplicateListingDialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ListingsHeader } from "./listings/ListingsHeader";
import { ListingsPagination } from "./listings/ListingsPagination";

interface ListingsSectionProps {
  listings: any[];
  onDelete: (ids: string[]) => void;
  currentPage: number;
  onLoadMore: () => void;
  hasMore: boolean;
  onListingsUpdate: () => void;
}

export const ListingsSection = ({
  listings: initialListings,
  onDelete,
  currentPage,
  onLoadMore,
  hasMore,
  onListingsUpdate,
}: ListingsSectionProps) => {
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateListingName, setDuplicateListingName] = useState("");
  const [pendingListingData, setPendingListingData] = useState<any>(null);
  const [filteredListings, setFilteredListings] = useState(initialListings);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFilteredListings(initialListings);
  }, [initialListings]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterListings(query, selectedCategory);
  };

  const handleCategoryChange = (category: string | null) => {
    console.log("Category changed to:", category);
    setSelectedCategory(category);
    filterListings(searchQuery, category);
  };

  const filterListings = (query: string, category: string | null) => {
    console.log("Filtering listings with query:", query, "and category:", category);
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

    console.log("Filtered listings:", filtered);
    setFilteredListings(filtered);
  };

  const handleCsvUpload = async (data: any[]) => {
    if (data && data.length > 0) {
      setPendingListingData(data[0]);
      setDuplicateListingName(data[0].name || '');
      setShowDuplicateDialog(true);
    }
  };

  const handleCsvAction = async (action: "create" | "merge" | "ignore") => {
    if (!pendingListingData) return;
    
    if (action === "create") {
      const { error } = await supabase
        .from('listings')
        .insert([pendingListingData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create listings",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Listings created successfully",
      });
      onListingsUpdate();
    }
    
    setPendingListingData(null);
    setShowDuplicateDialog(false);
  };

  const handleLoadMore = async () => {
    setIsLoading(true);
    await onLoadMore();
    setIsLoading(false);
  };

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm border border-muted animate-fade-in">
        <CardHeader>
          <CardTitle>Upload Listings</CardTitle>
          <CardDescription>Upload your CSV file with listing data</CardDescription>
        </CardHeader>
        <CardContent>
          <CsvUploader onUpload={handleCsvUpload} />
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border border-muted animate-fade-in mt-8">
        <CardHeader>
          <CardTitle>Manage Listings</CardTitle>
          <CardDescription>View and manage all listings</CardDescription>
        </CardHeader>
        <CardContent>
          <ListingsHeader
            onSearch={handleSearch}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onDelete={onDelete}
            listings={filteredListings}
          />
          <ListingsTable 
            listings={filteredListings}
            onDelete={onDelete}
            currentPage={currentPage}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
          />
          <ListingsPagination 
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <DuplicateListingDialog
        isOpen={showDuplicateDialog}
        onClose={() => setShowDuplicateDialog(false)}
        onAction={handleCsvAction}
        duplicateName={duplicateListingName}
      />
    </>
  );
};