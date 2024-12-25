import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormValues } from "./types";

interface ArticleFormFieldsProps {
  form: UseFormReturn<ArticleFormValues>;
}

export const ArticleFormFields = ({ form }: ArticleFormFieldsProps) => {
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
    <div className="space-y-6">
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
                className="bg-[#2A2F3E] border-gray-600 text-white placeholder:text-gray-400"
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Content</FormLabel>
            <FormControl>
              <RichTextEditor
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />

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
    </div>
  );
};