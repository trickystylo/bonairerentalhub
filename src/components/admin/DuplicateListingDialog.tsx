import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DuplicateListingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: 'create' | 'merge' | 'ignore') => void;
  duplicateName: string;
}

export const DuplicateListingDialog = ({
  isOpen,
  onClose,
  onAction,
  duplicateName,
}: DuplicateListingDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Duplicate Listing Found</DialogTitle>
          <DialogDescription>
            A listing with the name "{duplicateName}" already exists. What would you like to do?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={() => onAction('create')}
            className="bg-gradient-caribbean"
          >
            Create New Listing
          </Button>
          <Button
            onClick={() => onAction('merge')}
            variant="outline"
          >
            Merge New Information
          </Button>
          <Button
            onClick={() => onAction('ignore')}
            variant="ghost"
          >
            Ignore Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};