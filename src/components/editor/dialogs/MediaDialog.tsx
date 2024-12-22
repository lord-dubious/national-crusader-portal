import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

interface MediaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

export const MediaDialog = ({ isOpen, onOpenChange, onSelect }: MediaDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Media Library</DialogTitle>
      </DialogHeader>
      <MediaLibrary onSelect={onSelect} />
    </DialogContent>
  </Dialog>
);