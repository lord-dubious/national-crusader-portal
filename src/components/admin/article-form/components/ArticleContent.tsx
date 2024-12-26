import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { useFormContext } from "react-hook-form";
import { ArticleFormValues } from "../types";

export const ArticleContent = () => {
  const form = useFormContext<ArticleFormValues>();

  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Content</FormLabel>
          <FormControl>
            <RichTextEditor
              value={field.value || ""}
              onChange={(value) => {
                console.log("Editor content updated:", value);
                field.onChange(value);
              }}
            />
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};