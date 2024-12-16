import { Button } from "@/components/ui/button";

interface ListingsPaginationProps {
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading?: boolean;
}

export const ListingsPagination = ({ 
  hasMore, 
  onLoadMore,
  isLoading 
}: ListingsPaginationProps) => {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-8">
      <Button 
        onClick={onLoadMore} 
        variant="outline"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Load More"}
      </Button>
    </div>
  );
};