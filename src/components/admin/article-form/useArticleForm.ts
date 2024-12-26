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

      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(id, name),
          author:profiles(id, email)
        `)
        .eq("id", parseInt(articleId, 10))
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch article",
          variant: "destructive",
        });
        throw error;
      }

      return data as Article;
    },
    enabled: !!articleId,
  });

  React.useEffect(() => {
    if (article) {
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