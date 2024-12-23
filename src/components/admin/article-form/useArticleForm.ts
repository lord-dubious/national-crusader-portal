import * as React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Article, ArticleFormValues } from "./types";

export const useArticleForm = (articleId?: string) => {
  const { toast } = useToast();
  const form = useForm<ArticleFormValues>({
    defaultValues: {
      title: "",
      content: "",
      category_id: null,
      status: "draft",
      excerpt: "",
      featured_image: null,
      is_featured: false,
      author_id: null,
      tag_ids: [],
    },
  });

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      if (!articleId) return null;
      
      // First, get the article data
      const { data: articleData, error: articleError } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .single();

      if (articleError) {
        toast({
          variant: "destructive",
          title: "Error fetching article",
          description: articleError.message,
        });
        throw articleError;
      }

      // Then, get the article's tags
      const { data: articleTags, error: tagsError } = await supabase
        .from("article_tags")
        .select("tag_id")
        .eq("article_id", articleId);

      if (tagsError) {
        toast({
          variant: "destructive",
          title: "Error fetching article tags",
          description: tagsError.message,
        });
        throw tagsError;
      }

      // Extract tag IDs from the article_tags relation
      const tagIds = articleTags.map((at) => at.tag_id);
      
      return {
        ...articleData,
        tag_ids: tagIds,
      } as Article & { tag_ids: number[] };
    },
    enabled: !!articleId,
  });

  // Update form values when article data is loaded
  React.useEffect(() => {
    if (article) {
      console.log("Setting form values:", article); // Debug log
      form.reset({
        title: article.title,
        content: article.content,
        category_id: article.category_id,
        status: article.status || "draft",
        excerpt: article.excerpt,
        featured_image: article.featured_image,
        is_featured: article.is_featured || false,
        author_id: article.author_id,
        tag_ids: article.tag_ids,
      });
    }
  }, [article, form]);

  return { form, article, isLoading };
};