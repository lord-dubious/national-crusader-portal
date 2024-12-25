import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArticleFormValues, Article } from "./types";
import React from "react";

export const useArticleForm = (articleId?: string) => {
  const { toast } = useToast();
  const form = useForm<ArticleFormValues>();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      if (!articleId) return null;

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error("No authenticated session");
      }

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", articleId)
        .single();

      if (error) {
        console.error("Error fetching article:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load article. Please try again.",
        });
        throw error;
      }

      return data as Article;
    },
    retry: 1,
    enabled: !!articleId,
  });

  React.useEffect(() => {
    if (article) {
      console.log("Setting form values with:", article);
      
      form.setValue("title", article.title || "");
      form.setValue("content", article.content || "");
      form.setValue("category_id", article.category_id || null);
      form.setValue("status", article.status || "draft");
      form.setValue("excerpt", article.excerpt || "");
      form.setValue("featured_image", article.featured_image || null);
      form.setValue("is_featured", article.is_featured || false);
      form.setValue("author_id", article.author_id || null);
    }
  }, [article, form]);

  return {
    form,
    article,
    isLoading,
  };
};