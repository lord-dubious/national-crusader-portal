import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArticleFormValues } from "./types";
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

      return data;
    },
    retry: 1,
    enabled: !!articleId,
  });

  React.useEffect(() => {
    if (article) {
      console.log("Setting form values with:", article);
      
      // Set each form field individually with null checks
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

  const onSubmit = async (values: ArticleFormValues) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to perform this action.",
        });
        return;
      }

      const slug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const articleData = {
        ...values,
        slug,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (articleId) {
        const { error: updateError } = await supabase
          .from("articles")
          .update(articleData)
          .eq("slug", articleId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("articles")
          .insert([articleData]);
        error = insertError;
      }

      if (error) {
        console.error("Error saving article:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save article. Please try again.",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Article ${articleId ? "updated" : "created"} successfully.`,
      });
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
  };
};