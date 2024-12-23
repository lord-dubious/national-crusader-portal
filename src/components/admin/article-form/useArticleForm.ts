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

  const { data: article } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const { data: articleData, error: articleError } = await supabase
        .from("articles")
        .select(`
          *,
          article_tags(
            tag_id
          )
        `)
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

      // Extract tag IDs from the article_tags relation
      const tagIds = articleData.article_tags?.map((at: any) => at.tag_id) || [];
      
      return {
        ...articleData,
        tag_ids: tagIds,
      } as Article & { tag_ids: number[] };
    },
    enabled: !!articleId,
  });

  React.useEffect(() => {
    if (article) {
      form.reset({
        ...article,
        category_id: article.category_id,
        tag_ids: article.tag_ids,
      });
    }
  }, [article, form]);

  return { form, article };
};