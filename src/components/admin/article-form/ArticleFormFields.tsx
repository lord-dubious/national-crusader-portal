import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormValues } from "./types";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching tags",
          description: error.message
        });
        throw error;
      }
      return data;
    },
  });

  const selectedTags = form.watch("tag_ids") || [];

  const handleTagSelect = (tagId: string) => {
    const currentTags = form.getValues("tag_ids") || [];
    const tagIdNum = parseInt(tagId);
    
    if (!currentTags.includes(tagIdNum)) {
      form.setValue("tag_ids", [...currentTags, tagIdNum]);
    }
  };

  const handleRemoveTag = (tagId: number) => {
    const currentTags = form.getValues("tag_ids") || [];
    form.setValue("tag_ids", currentTags.filter(id => id !== tagId));
  };

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Article title" {...field} />
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
            <FormLabel>Category</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value?.toString() || ""}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
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
        name="tag_ids"
        render={() => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <Select onValueChange={handleTagSelect}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select tags" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tags?.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id.toString()}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tagId) => {
                const tag = tags?.find(t => t.id === tagId);
                if (!tag) return null;
                return (
                  <Badge key={tag.id} variant="secondary" className="px-2 py-1">
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag.id)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="excerpt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Excerpt</FormLabel>
            <FormControl>
              <Input placeholder="Brief excerpt" {...field} />
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
            <FormLabel>Content</FormLabel>
            <FormControl>
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || "draft"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
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
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Featured Article</FormLabel>
              <div className="text-sm text-muted-foreground">
                Display this article in the hero section
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};