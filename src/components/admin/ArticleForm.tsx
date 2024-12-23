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

      if (article) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", article.id);

        if (error) throw error;
        toast({ title: "Article updated successfully" });
      } else {
        const { error } = await supabase
          .from("articles")
          .insert([articleData]);

        if (error) throw error;
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