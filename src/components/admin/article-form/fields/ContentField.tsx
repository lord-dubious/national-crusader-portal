import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormValues } from "../types";

interface ContentFieldProps {
  form: UseFormReturn<ArticleFormValues>;
}

export const ContentField = ({ form }: ContentFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-semibold">Content</FormLabel>
          <FormControl>
            <div className="border rounded-lg overflow-hidden">
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};