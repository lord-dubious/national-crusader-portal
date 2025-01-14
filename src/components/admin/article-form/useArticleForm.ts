import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "./types";
import { useToast } from "@/hooks/use-toast";

export const useArticleForm = (articleId?: string) => {
  const { toast } = useToast();
  const [initialValues, setInitialValues] = React.useState<Partial<Article> | null>(null);

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      if (!articleId) return null;

      // First, fetch the article with its relations
      const { data: articleData, error: articleError } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(id, name),
          author:profiles(id, email)
        `)
        .eq("id", parseInt(articleId, 10))
        .single();

      if (articleError) {
        toast({
          title: "Error",
          description: "Failed to fetch article",
          variant: "destructive",
        });
        throw articleError;
      }

      // Then fetch the article's tags
      const { data: tagData, error: tagError } = await supabase
        .from("article_tags")
        .select("tag_id")
        .eq("article_id", parseInt(articleId, 10));

      if (tagError) {
        console.error("Error fetching article tags:", tagError);
        return articleData;
      }

      // Extract tag IDs from the tag relations
      const tags = tagData.map(t => t.tag_id);

      // Return article data with tags
      return {
        ...articleData,
        tags
      } as Article;
    },
    enabled: !!articleId,
  });

  React.useEffect(() => {
    if (article) {
      console.log("Setting article with tags:", article);
      setInitialValues({
        ...article,
        category_id: article.category?.id,
      });
    }
  }, [article]);

  return {
    article,
    initialValues,
    isLoading,
  };
};