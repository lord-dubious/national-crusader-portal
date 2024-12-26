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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ArticleFormProps {
  articleId?: string;
}

export const ArticleForm = ({ articleId }: ArticleFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { form, article, isLoading, error } = useArticleForm(articleId);

  const onSubmit = async (values: ArticleFormValues) => {
    try {
      const slug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const articleData = {
        title: values.title,
        content: values.content,
        category_id: values.category_id,
        status: values.status,
        excerpt: values.excerpt,
        featured_image: values.featured_image,
        is_featured: values.is_featured,
        author_id: values.author_id,
        slug,
        updated_at: new Date().toISOString(),
        published_at: values.status === "published" ? new Date().toISOString() : null,
      };

      console.log("Submitting article data:", articleData);

      if (articleId) {
        const { error: updateError } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", articleId);

        if (updateError) {
          console.error("Error updating article:", updateError);
          throw updateError;
        }

        console.log("Article updated successfully");
        toast({ title: "Article updated successfully" });
      } else {
        const { error: insertError } = await supabase
          .from("articles")
          .insert([articleData]);

        if (insertError) {
          console.error("Error creating article:", insertError);
          throw insertError;
        }

        console.log("Article created successfully");
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

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (articleId && !article) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Article not found. It may have been deleted or you don't have permission to access it.
        </AlertDescription>
      </Alert>
    );
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