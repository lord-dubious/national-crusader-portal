import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { ArticleFormValues } from "../types";

export const ArticleStatus = () => {
  const form = useFormContext<ArticleFormValues>();

  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Status</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || "draft"}
          >
            <FormControl>
              <SelectTrigger className="bg-[#2A2F3E] border-gray-600 text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-[#2A2F3E] border-gray-600">
              <SelectItem 
                value="draft"
                className="text-white hover:bg-[#3A3F4E]"
              >
                Draft
              </SelectItem>
              <SelectItem 
                value="published"
                className="text-white hover:bg-[#3A3F4E]"
              >
                Published
              </SelectItem>
              <SelectItem 
                value="archived"
                className="text-white hover:bg-[#3A3F4E]"
              >
                Archived
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};