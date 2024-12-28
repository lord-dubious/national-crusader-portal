import { ArticleBasicInfo } from "./components/ArticleBasicInfo";
import { ArticleCategory } from "./components/ArticleCategory";
import { ArticleContent } from "./components/ArticleContent";
import { ArticleStatus } from "./components/ArticleStatus";
import { ArticleTags } from "./components/ArticleTags";
import { ArticleImage } from "./components/ArticleImage";
import { Switch } from "@/components/ui/switch";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { ArticleFormValues } from "./types";

export const ArticleFormFields = () => {
  const form = useFormContext<ArticleFormValues>();

  return (
    <div className="space-y-6">
      <ArticleBasicInfo />
      <ArticleImage />
      <ArticleCategory />
      <ArticleContent />
      <ArticleTags />
      <FormField
        control={form.control}
        name="is_featured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-white">Featured Article</FormLabel>
              <div className="text-sm text-gray-400">
                Display this article in featured sections
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-accent"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <ArticleStatus />
    </div>
  );
};