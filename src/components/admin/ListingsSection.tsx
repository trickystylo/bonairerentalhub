import { ListingsContainer } from "./listings/ListingsContainer";

interface ListingsSectionProps {
  listings: any[];
  onDelete: (ids: string[]) => void;
  currentPage: number;
  onLoadMore: () => void;
  hasMore: boolean;
  onListingsUpdate: () => void;
}

export const ListingsSection = (props: ListingsSectionProps) => {
  return <ListingsContainer {...props} />;
};