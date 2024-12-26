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
    },
  });

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      if (!articleId) return null;
      
      console.log("Fetching article with ID:", articleId);
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching article:", error);
        throw error;
      }

      if (!data) {
        console.log("No article found with ID:", articleId);
        return null;
      }

      console.log("Fetched article data:", data);
      return data as Article;
    },
    enabled: !!articleId,
    retry: false,
  });

  React.useEffect(() => {
    if (article) {
      console.log("Setting form values with article data:", article);
      form.reset({
        title: article.title,
        content: article.content || "",
        category_id: article.category_id,
        status: article.status || "draft",
        excerpt: article.excerpt || "",
        featured_image: article.featured_image,
        is_featured: article.is_featured || false,
        author_id: article.author_id,
      });
    }
  }, [article, form]);

  return { form, article, isLoading, error };
};