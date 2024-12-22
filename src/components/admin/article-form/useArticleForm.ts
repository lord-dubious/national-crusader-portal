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

  const { data: article } = useQuery<Article>({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .maybeSingle();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching article",
          description: error.message,
        });
        throw error;
      }

      return data;
    },
    enabled: !!articleId,
  });

  React.useEffect(() => {
    if (article) {
      form.reset({
        ...article,
        category_id: article.category_id,
      });
    }
  }, [article, form]);

  return { form, article };
};