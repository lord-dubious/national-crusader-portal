import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArticleFormFields } from "./article-form/ArticleFormFields";
import { articleFormSchema, type ArticleFormValues } from "./article-form/types";
import { useArticleForm } from "./article-form/useArticleForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

interface ArticleFormProps {
  articleId?: string;
}

export const ArticleForm = ({ articleId }: ArticleFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { initialValues, isLoading } = useArticleForm(articleId);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category_id: null,
      status: "draft",
      excerpt: "",
      featured_image: "",
      is_featured: false,
      author_id: "",
    },
  });

  React.useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const onSubmit = async (values: ArticleFormValues) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const slug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const articleData = {
        title: values.title,
        content: values.content,
        category_id: values.category_id,
        status: values.status,
        excerpt: values.excerpt || "",
        featured_image: values.featured_image,
        is_featured: values.is_featured,
        author_id: values.author_id || userData.user?.id,
        slug,
        updated_at: new Date().toISOString(),
        published_at: values.status === "published" ? new Date().toISOString() : null,
      };

      console.log("Saving article data:", articleData);

      if (articleId) {
        console.log("Updating article with ID:", articleId);
        const { error: updateError } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", parseInt(articleId, 10));

        if (updateError) {
          console.error("Error updating article:", updateError);
          toast({
            title: "Error",
            description: "Failed to update article",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Article updated successfully",
        });
      } else {
        const { error: createError } = await supabase
          .from("articles")
          .insert([articleData]);

        if (createError) {
          console.error("Error creating article:", createError);
          toast({
            title: "Error",
            description: "Failed to create article",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Article created successfully",
        });
      }

      navigate("/admin/articles");
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        title: "Error",
        description: "Failed to save article",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ArticleFormFields />
        <Button type="submit" variant="active">
          {articleId ? "Update Article" : "Create Article"}
        </Button>
      </form>
    </Form>
  );
};