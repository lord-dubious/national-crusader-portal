import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
        <DialogDescription>
          Select or upload media files to include in your content.
        </DialogDescription>
      </DialogHeader>
      <MediaLibrary onSelect={onSelect} />
    </DialogContent>
  </Dialog>
);