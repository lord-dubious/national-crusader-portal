import { UseFormReturn } from "react-hook-form";
import { ArticleFormValues } from "./types";
import { TitleField } from "./fields/TitleField";
import { CategoryField } from "./fields/CategoryField";
import { TagsField } from "./fields/TagsField";
import { ContentField } from "./fields/ContentField";
import { StatusField } from "./fields/StatusField";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface ArticleFormFieldsProps {
  form: UseFormReturn<ArticleFormValues>;
}

export const ArticleFormFields = ({ form }: ArticleFormFieldsProps) => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <TitleField form={form} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <CategoryField form={form} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <StatusField form={form} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <TagsField form={form} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <ContentField form={form} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <FormField
          control={form.control}
          name="is_featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg">
              <div className="space-y-0.5">
                <FormLabel className="text-lg font-semibold">Featured Article</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Display this article in the hero section
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};