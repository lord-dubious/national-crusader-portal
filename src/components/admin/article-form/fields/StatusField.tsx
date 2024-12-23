import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormValues } from "../types";

interface StatusFieldProps {
  form: UseFormReturn<ArticleFormValues>;
}

export const StatusField = ({ form }: StatusFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-semibold text-white">Status</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || "draft"}
          >
            <FormControl>
              <SelectTrigger className="h-12 bg-[#333333] border-[#444444] text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-[#333333] border-[#444444]">
              <SelectItem value="draft" className="text-white hover:bg-[#444444] focus:bg-[#444444] focus:text-white">Draft</SelectItem>
              <SelectItem value="published" className="text-white hover:bg-[#444444] focus:bg-[#444444] focus:text-white">Published</SelectItem>
              <SelectItem value="archived" className="text-white hover:bg-[#444444] focus:bg-[#444444] focus:text-white">Archived</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage className="text-[#ea384c]" />
        </FormItem>
      )}
    />
  );
};