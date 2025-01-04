import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LinkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  linkUrl: string;
  onLinkUrlChange: (url: string) => void;
  onSetLink: () => void;
}

export const LinkDialog = ({
  isOpen,
  onOpenChange,
  linkUrl,
  onLinkUrlChange,
  onSetLink,
}: LinkDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Insert Link</DialogTitle>
        <DialogDescription>
          Enter the URL for your link below.
        </DialogDescription>
      </DialogHeader>
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Enter URL"
          value={linkUrl}
          onChange={(e) => onLinkUrlChange(e.target.value)}
        />
        <Button onClick={onSetLink}>Add Link</Button>
      </div>
    </DialogContent>
  </Dialog>
);