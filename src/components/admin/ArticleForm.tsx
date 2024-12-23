import * as React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArticleFormFields } from "./article-form/ArticleFormFields";
import { useArticleForm } from "./article-form/useArticleForm";
import { ArticleFormValues } from "./article-form/types";

interface ArticleFormProps {
  articleId?: string;
}

export const ArticleForm = ({ articleId }: ArticleFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { form, article } = useArticleForm(articleId);

  const onSubmit = async (values: ArticleFormValues) => {
    try {
      const slug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const articleData = {
        ...values,
        slug,
        published_at: values.status === "published" ? new Date().toISOString() : null,
      };

      // Remove tag_ids from articleData as it's not a column in the articles table
      const { tag_ids, ...articleDataWithoutTags } = articleData;

      if (article) {
        const { error: articleError } = await supabase
          .from("articles")
          .update(articleDataWithoutTags)
          .eq("id", article.id);

        if (articleError) throw articleError;

        // Delete existing tags
        const { error: deleteError } = await supabase
          .from("article_tags")
          .delete()
          .eq("article_id", article.id);

        if (deleteError) throw deleteError;

        // Insert new tags if any
        if (tag_ids && tag_ids.length > 0) {
          const { error: tagError } = await supabase
            .from("article_tags")
            .insert(tag_ids.map(tagId => ({
              article_id: article.id,
              tag_id: tagId
            })));

          if (tagError) throw tagError;
        }

        toast({ title: "Article updated successfully" });
      } else {
        const { data: newArticle, error: articleError } = await supabase
          .from("articles")
          .insert([articleDataWithoutTags])
          .select()
          .single();

        if (articleError) throw articleError;

        // Insert tags if any
        if (tag_ids && tag_ids.length > 0) {
          const { error: tagError } = await supabase
            .from("article_tags")
            .insert(tag_ids.map(tagId => ({
              article_id: newArticle.id,
              tag_id: tagId
            })));

          if (tagError) throw tagError;
        }

        toast({ title: "Article created successfully" });
      }

      navigate("/admin/articles");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving article",
        description: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ArticleFormFields form={form} />
        <Button type="submit" className="w-full">
          {article ? "Update" : "Create"} Article
        </Button>
      </form>
    </Form>
  );
};