import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArticleRow } from "./ArticleRow";
import type { Article } from "./types";

export const RecentArticles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: articles, refetch } = useQuery({
    queryKey: ["recent-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(name),
          author:profiles(email)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      return (data as any[]).map(article => ({
        ...article,
        author: article.author?.[0] || null,
        category: article.category || null
      })) as Article[];
    },
  });

  const handleDeleteArticle = async (id: number) => {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error deleting article",
        description: error.message
      });
    } else {
      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted."
      });
      refetch();
    }
  };

  const handleArchiveArticle = async (id: number) => {
    const { error } = await supabase
      .from('articles')
      .update({ status: 'archived' })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error archiving article",
        description: error.message
      });
    } else {
      toast({
        title: "Article archived",
        description: "The article has been moved to archives."
      });
      refetch();
    }
  };

  const handleHideArticle = async (id: number) => {
    const { error } = await supabase
      .from('articles')
      .update({ status: 'hidden' })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error hiding article",
        description: error.message
      });
    } else {
      toast({
        title: "Article hidden",
        description: "The article has been hidden from view."
      });
      refetch();
    }
  };

  return (
    <Card className="bg-[#222222] border-[#333333] overflow-hidden">
      <CardHeader>
        <CardTitle className="text-white">Recent Articles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#333333]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8E9196] uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8E9196] uppercase tracking-wider hidden md:table-cell">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8E9196] uppercase tracking-wider hidden lg:table-cell">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8E9196] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8E9196] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333333]">
                {articles?.map((article) => (
                  <ArticleRow
                    key={article.id}
                    article={article}
                    onEdit={(id) => navigate(`/admin/edit-article/${id}`)}
                    onArchive={handleArchiveArticle}
                    onHide={handleHideArticle}
                    onDelete={handleDeleteArticle}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};