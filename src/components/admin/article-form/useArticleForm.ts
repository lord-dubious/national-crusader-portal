import * as React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Article, ArticleFormValues } from "./types";

export const useArticleForm = (articleId?: string) => {
  const { toast } = useToast();
  const form = useForm<ArticleFormValues>();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      if (!articleId) return null;
      
      console.log("Fetching article with ID:", articleId);
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching article:", error);
        toast({
          variant: "destructive",
          title: "Error fetching article",
          description: error.message,
        });
        throw error;
      }

      console.log("Fetched article data:", data);
      return data as Article;
    },
    enabled: !!articleId,
  });

  React.useEffect(() => {
    if (article) {
      console.log("Setting form values with:", article);
      form.setValue("title", article.title);
      form.setValue("content", article.content);
      form.setValue("category_id", article.category_id);
      form.setValue("status", article.status || "draft");
      form.setValue("excerpt", article.excerpt || "");
      form.setValue("featured_image", article.featured_image);
      form.setValue("is_featured", article.is_featured || false);
      form.setValue("author_id", article.author_id);
    }
  }, [article, form]);

  return { form, article, isLoading };
};