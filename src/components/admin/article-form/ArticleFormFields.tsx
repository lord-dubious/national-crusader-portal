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
      <div className="bg-[#222222] p-6 rounded-lg shadow-lg border border-[#333333]">
        <TitleField form={form} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#222222] p-6 rounded-lg shadow-lg border border-[#333333]">
          <CategoryField form={form} />
        </div>
        <div className="bg-[#222222] p-6 rounded-lg shadow-lg border border-[#333333]">
          <StatusField form={form} />
        </div>
      </div>

      <div className="bg-[#222222] p-6 rounded-lg shadow-lg border border-[#333333]">
        <TagsField form={form} />
      </div>

      <div className="bg-[#222222] p-6 rounded-lg shadow-lg border border-[#333333]">
        <ContentField form={form} />
      </div>

      <div className="bg-[#222222] p-6 rounded-lg shadow-lg border border-[#333333]">
        <FormField
          control={form.control}
          name="is_featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg">
              <div className="space-y-0.5">
                <FormLabel className="text-lg font-semibold text-white">Featured Article</FormLabel>
                <div className="text-sm text-gray-400">
                  Display this article in the hero section
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-[#ea384c]"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};