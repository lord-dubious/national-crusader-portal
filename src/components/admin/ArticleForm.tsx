import * as React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArticleFormFields } from "./article-form/ArticleFormFields";
import { useArticleForm } from "./article-form/useArticleForm";
import { ArticleFormValues } from "./article-form/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ArticleFormProps {
  articleId?: string;
}

export const ArticleForm = ({ articleId }: ArticleFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { form, article, isLoading } = useArticleForm(articleId);

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

      console.log("Submitting article data:", articleData);

      if (articleId) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", articleId);

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
      console.error("Error saving article:", error);
      toast({
        variant: "destructive",
        title: "Error saving article",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 bg-[#1A1F2C] rounded-lg">
        <Skeleton className="h-8 w-1/3 bg-gray-700" />
        <Skeleton className="h-10 w-full bg-gray-700" />
        <Skeleton className="h-10 w-full bg-gray-700" />
        <Skeleton className="h-40 w-full bg-gray-700" />
      </div>
    );
  }

  if (articleId && !article) {
    return <div className="text-white p-6">Article not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#1A1F2C] rounded-lg shadow-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            {articleId ? "Edit Article" : "Create New Article"}
          </h2>
          <div className="space-y-6 text-white">
            <ArticleFormFields form={form} />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#DC2626] hover:bg-[#DC2626]/90 text-white font-semibold"
          >
            {articleId ? "Update" : "Create"} Article
          </Button>
        </form>
      </Form>
    </div>
  );
};