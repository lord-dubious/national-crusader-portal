import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'admin@nationalcrusader.com') {
        navigate('/');
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You must be an admin to access this page."
        });
      }
    };
    checkAdmin();
  }, [navigate, toast]);

  const { data: articles, error } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching articles",
          description: error.message
        });
        throw error;
      }
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
    }
  };

  if (error) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => navigate('/admin/new-article')}>
            Create New Article
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{articles?.length || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Published Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {articles?.filter(a => a.status === 'published').length || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Draft Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {articles?.filter(a => a.status === 'draft').length || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Articles</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {articles?.map((article) => (
                    <tr key={article.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium">{article.title}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm">{article.category?.name || 'Uncategorized'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;