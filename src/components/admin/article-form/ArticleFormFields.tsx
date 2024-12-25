import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { ArticleFormValues } from "./types";
import { UseFormReturn } from "react-hook-form";

interface ArticleFormFieldsProps {
  form: UseFormReturn<ArticleFormValues>;
}

export const ArticleFormFields = ({ form }: ArticleFormFieldsProps) => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
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
                placeholder="Article title..." 
                {...field}
                value={field.value || ""}
                className="bg-[#2A2F3E] border-gray-600 text-white placeholder:text-gray-400"
              />
            </FormControl>
            <FormMessage />
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
                className="min-h-[400px] bg-[#2A2F3E] border-gray-600 text-white"
              />
            </FormControl>
            <FormMessage />
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
              <Textarea 
                placeholder="Write a brief excerpt..." 
                {...field}
                value={field.value || ""}
                className="bg-[#2A2F3E] border-gray-600 text-white placeholder:text-gray-400 min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
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
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value?.toString()}
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
                    className="text-white hover:bg-gray-700"
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

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Status</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="bg-[#2A2F3E] border-gray-600 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-[#2A2F3E] border-gray-600">
                <SelectItem value="draft" className="text-white hover:bg-gray-700">Draft</SelectItem>
                <SelectItem value="published" className="text-white hover:bg-gray-700">Published</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_featured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-white">Featured Article</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};