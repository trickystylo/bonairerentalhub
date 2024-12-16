import { CsvSection } from "./CsvSection";
import { ListingsManageSection } from "./ListingsManageSection";

interface ListingsContainerProps {
  listings: any[];
  onDelete: (ids: string[]) => void;
  currentPage: number;
  onLoadMore: () => void;
  hasMore: boolean;
  onListingsUpdate: () => void;
}

export const ListingsContainer = ({
  listings,
  onDelete,
  onListingsUpdate,
}: ListingsContainerProps) => {
  return (
    <>
      <CsvSection onListingsUpdate={onListingsUpdate} />
      <ListingsManageSection 
        listings={listings}
        onDelete={onDelete}
      />
    </>
  );
};