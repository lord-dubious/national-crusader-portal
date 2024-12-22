import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ArticleFormProps {
  articleId?: number;
  onSubmit: (data: any) => Promise<void>;
}

interface Article {
  id: number;
  title: string;
  content: string;
  category_id: string;
  status: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  excerpt: string;
  featured_image: string;
  is_featured: boolean;
  published_at: string;
  slug: string;
}

export const ArticleForm = ({ articleId, onSubmit }: ArticleFormProps) => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      category_id: "",
      status: "draft"
    }
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: article } = useQuery<Article>({
    queryKey: ["article", articleId],
    queryFn: async () => {
      if (!articleId) return null;
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!articleId,
    onSettled: (data) => {
      if (data) {
        form.reset(data);
      }
    }
  });

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      toast({
        title: `Article ${articleId ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Failed to ${articleId ? "update" : "create"} article`,
        description: error.message
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
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
                defaultValue={field.value}
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor 
                  content={field.value} 
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
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {articleId ? "Update" : "Create"} Article
        </Button>
      </form>
    </Form>
  );
};