import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { Image as ImageIcon } from "lucide-react";
import { ArticleFormValues } from "../types";

export const ArticleImage = () => {
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const form = useFormContext<ArticleFormValues>();
  const featuredImage = form.watch("featured_image");

  const handleImageSelect = (url: string) => {
    form.setValue("featured_image", url);
    setIsMediaDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="featured_image"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Featured Image</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {featuredImage && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-600">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsMediaDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  {featuredImage ? "Change Image" : "Select Image"}
                </Button>
              </div>
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

      <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
          </DialogHeader>
          <MediaLibrary onSelect={handleImageSelect} />
        </DialogContent>
      </Dialog>
    </div>
  );
};