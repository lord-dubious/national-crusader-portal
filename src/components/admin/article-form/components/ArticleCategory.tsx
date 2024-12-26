import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArticleFormValues } from "../types";

export const ArticleCategory = () => {
  const { toast } = useToast();
  const form = useFormContext<ArticleFormValues>();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching categories",
          description: error.message
        });
        throw error;
      }
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="category_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Category</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
            value={field.value?.toString() || ""}
          >
            <FormControl>
              <SelectTrigger className="bg-[#2A2F3E] border-gray-600 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-[#2A2F3E] border-gray-600">
              {categories?.map((category) => (
                <SelectItem 
                  key={category.id} 
                  value={category.id.toString()}
                  className="text-white hover:bg-[#3A3F4E]"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};