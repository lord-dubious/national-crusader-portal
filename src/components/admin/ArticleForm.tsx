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
  const { form, article, isLoading } = useArticleForm(articleId);

  const onSubmit = async (values: ArticleFormValues) => {
    try {
      console.log("Form values:", values);
      console.log("Article ID:", articleId);

      const slug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const articleData = {
        ...values,
        slug,
        published_at: values.status === "published" ? new Date().toISOString() : null,
      };

      const { tag_ids, ...articleDataWithoutTags } = articleData;

      if (articleId) {
        console.log("Updating article with data:", articleDataWithoutTags);
        
        const { error: articleError } = await supabase
          .from("articles")
          .update({
            ...articleDataWithoutTags,
            updated_at: new Date().toISOString(),
          })
          .eq("id", articleId);

        if (articleError) {
          console.error("Error updating article:", articleError);
          throw articleError;
        }

        const { error: deleteError } = await supabase
          .from("article_tags")
          .delete()
          .eq("article_id", articleId);

        if (deleteError) {
          console.error("Error deleting tags:", deleteError);
          throw deleteError;
        }

        if (tag_ids && tag_ids.length > 0) {
          const { error: tagError } = await supabase
            .from("article_tags")
            .insert(tag_ids.map(tagId => ({
              article_id: Number(articleId),
              tag_id: tagId
            })));

          if (tagError) {
            console.error("Error inserting tags:", tagError);
            throw tagError;
          }
        }

        toast({ title: "Article updated successfully" });
      } else {
        const { data: newArticle, error: articleError } = await supabase
          .from("articles")
          .insert([articleDataWithoutTags])
          .select()
          .single();

        if (articleError) throw articleError;

        if (tag_ids && tag_ids.length > 0 && newArticle) {
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
      console.error("Error saving article:", error);
      toast({
        variant: "destructive",
        title: "Error saving article",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
      <div className="text-lg text-white">Loading article...</div>
    </div>;
  }

  // Only render the form if we have article data when editing, or if we're creating a new article
  if (articleId && !article) {
    return <div className="flex items-center justify-center p-8">
      <div className="text-lg text-white">Article not found</div>
    </div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="text-2xl font-bold text-white mb-6">
          {articleId ? "Edit Article" : "Create New Article"}
        </h1>
        <ArticleFormFields form={form} />
        <Button 
          type="submit" 
          className="w-full bg-[#222222] text-white border-2 border-[#ea384c] hover:bg-[#333333] transition-colors"
        >
          {articleId ? "Update" : "Create"} Article
        </Button>
      </form>
    </Form>
  );
};