import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArticleFormFields } from "./ArticleFormFields";
import { articleFormSchema, type ArticleFormValues } from "./types";
import { useArticleForm } from "./useArticleForm";
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

  const handleSubmit = async (values: ArticleFormValues) => {
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

      if (articleId) {
        const { error: updateError } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", parseInt(articleId, 10));

        if (updateError) {
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <ArticleFormFields />
        <Button type="submit">
          {articleId ? "Update Article" : "Create Article"}
        </Button>
      </form>
    </Form>
  );
};