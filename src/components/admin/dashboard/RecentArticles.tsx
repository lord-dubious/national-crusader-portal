import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
          category:categories(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
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

  return (
    <Card className="bg-primary-foreground/10 border-primary-foreground/20 mt-8">
      <CardHeader>
        <CardTitle className="text-primary-foreground">Recent Articles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-foreground/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-primary-foreground">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-primary-foreground">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-primary-foreground">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-primary-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-foreground/10">
              {articles?.map((article) => (
                <tr key={article.id} className="hover:bg-primary-foreground/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-primary-foreground">{article.title}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-primary-foreground">{article.category?.name || 'Uncategorized'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      article.status === 'published' 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/edit-article/${article.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};