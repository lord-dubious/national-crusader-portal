import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ArticlesManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: articles, isLoading, refetch } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      console.log("Fetching fresh articles data...");
      const { data, error, count } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(name),
          author:profiles(username),
          article_tags(
            tag:tags(
              id,
              name,
              slug
            )
          )
        `, { count: 'exact' })
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load articles",
          variant: "destructive",
        });
        throw error;
      }

      // Transform the nested tags data structure
      const transformedData = data?.map(article => ({
        ...article,
        tags: article.article_tags
          .map(tagItem => tagItem.tag)
          .filter(tag => tag !== null)
      }));

      return { articles: transformedData, totalCount: count };
    },
    staleTime: 0, // Consider data stale immediately
    gcTime: 0, // Disable garbage collection (formerly cacheTime)
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Article deleted successfully",
    });
    refetch();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Articles</h2>
          <p className="text-sm text-gray-400">Total articles: {articles?.totalCount || 0}</p>
        </div>
        <Button onClick={() => navigate("/admin/new-article")} variant="active">
          New Article
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles?.articles?.map((article) => (
            <TableRow key={article.id}>
              <TableCell className="font-medium">{article.title}</TableCell>
              <TableCell>{article.category?.name || "Uncategorized"}</TableCell>
              <TableCell>{article.author?.username || "Unknown"}</TableCell>
              <TableCell className="capitalize">{article.status}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {article.tags?.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {article.published_at
                  ? format(new Date(article.published_at), "MMM d, yyyy")
                  : "Not published"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/edit-article/${article.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(article.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
