import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { ArticleFormValues } from "../types";

export const ArticleBasicInfo = () => {
  const form = useFormContext<ArticleFormValues>();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Article title" 
                {...field} 
                className="bg-[#2A2F3E] border-gray-600 text-white placeholder:text-gray-400"
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="excerpt"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Excerpt</FormLabel>
            <FormControl>
              <Input 
                placeholder="Brief excerpt" 
                {...field} 
                value={field.value || ""}
                className="bg-[#2A2F3E] border-gray-600 text-white placeholder:text-gray-400"
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
    </div>
  );
};