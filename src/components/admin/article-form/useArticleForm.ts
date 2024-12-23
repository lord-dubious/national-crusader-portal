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
      
      console.log("Fetching article with ID:", articleId); // Debug log
      
      // First, get the article data and related tags
      const { data: articleData, error: articleError } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(id, name),
          author:profiles(id, email),
          tags:article_tags(
            tag:tags(id, name)
          )
        `)
        .eq("id", articleId)
        .maybeSingle();

      if (articleError) {
        toast({
          variant: "destructive",
          title: "Error fetching article",
          description: articleError.message,
        });
        throw articleError;
      }

      if (!articleData) {
        toast({
          variant: "destructive",
          title: "Article not found",
          description: "The requested article could not be found.",
        });
        return null;
      }

      console.log("Fetched article data:", articleData); // Debug log

      // Transform the nested tags data into the expected format
      const transformedTags = articleData.tags?.map(
        (tagRelation: { tag: { id: number; name: string } }) => ({
          id: tagRelation.tag.id,
          name: tagRelation.tag.name,
        })
      ) || [];

      // Extract tag IDs for the form
      const tagIds = transformedTags.map((tag) => tag.id);

      // Return the article data with the correct tag structure
      return {
        ...articleData,
        tags: transformedTags,
        tag_ids: tagIds,
      };
    },
    enabled: !!articleId,
  });

  // Update form values when article data is loaded
  React.useEffect(() => {
    if (article) {
      console.log("Setting form values:", article); // Debug log
      form.reset({
        title: article.title || "",
        content: article.content || "",
        category_id: article.category_id,
        status: article.status || "draft",
        excerpt: article.excerpt || "",
        featured_image: article.featured_image || null,
        is_featured: article.is_featured || false,
        author_id: article.author_id,
        tag_ids: article.tag_ids || [],
      });
    }
  }, [article, form]);

  return { form, article, isLoading };
};