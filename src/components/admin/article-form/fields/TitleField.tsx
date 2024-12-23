import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormValues } from "../types";

interface TitleFieldProps {
  form: UseFormReturn<ArticleFormValues>;
}

export const TitleField = ({ form }: TitleFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-semibold text-white">Title</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter a compelling title for your article" 
              className="text-lg p-3 bg-[#333333] border-[#444444] text-white placeholder:text-gray-400"
              {...field} 
            />
          </FormControl>
          <FormMessage className="text-[#ea384c]" />
        </FormItem>
      )}
    />
  );
};