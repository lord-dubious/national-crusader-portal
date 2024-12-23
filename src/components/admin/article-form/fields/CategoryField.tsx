import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormValues } from "../types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CategoryFieldProps {
  form: UseFormReturn<ArticleFormValues>;
}

export const CategoryField = ({ form }: CategoryFieldProps) => {
  const { toast } = useToast();
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
          <FormLabel className="text-lg font-semibold">Category</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value?.toString() || ""}
          >
            <FormControl>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem 
                  key={category.id} 
                  value={category.id.toString()}
                  className="cursor-pointer hover:bg-accent"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};