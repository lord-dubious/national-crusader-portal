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
          <FormLabel className="text-lg font-semibold">Title</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter a compelling title for your article" 
              className="text-lg p-3"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};