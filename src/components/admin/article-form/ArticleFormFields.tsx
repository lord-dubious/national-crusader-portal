import { ArticleBasicInfo } from "./components/ArticleBasicInfo";
import { ArticleContent } from "./components/ArticleContent";
import { ArticleCategory } from "./components/ArticleCategory";
import { ArticleStatus } from "./components/ArticleStatus";
import { ArticleImage } from "./components/ArticleImage";
import { ArticleTags } from "./components/ArticleTags";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";
import { ArticleFormValues } from "./types";
import { Card, CardContent } from "@/components/ui/card";

export const ArticleFormFields = () => {
  const form = useFormContext<ArticleFormValues>();

  return (
    <div className="space-y-8">
      <ArticleBasicInfo />
      <ArticleContent />
      <ArticleCategory />
      <ArticleStatus />
      <ArticleImage />
      <ArticleTags />

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="has_video"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      This is a video article
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("has_video") && (
              <FormField
                control={form.control}
                name="video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter video URL (YouTube, Vimeo, or direct video link)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};