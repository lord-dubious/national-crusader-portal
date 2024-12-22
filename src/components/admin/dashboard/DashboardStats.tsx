import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FolderTree, Users, Eye } from "lucide-react";

export const DashboardStats = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [articles, categories, users, publishedArticles] = await Promise.all([
        supabase.from("articles").select("*", { count: "exact" }),
        supabase.from("categories").select("*", { count: "exact" }),
        supabase.from("profiles").select("*", { count: "exact" }),
        supabase.from("articles").select("*", { count: "exact" }).eq('status', 'published'),
      ]);

      return {
        articles: articles.count || 0,
        categories: categories.count || 0,
        users: users.count || 0,
        publishedArticles: publishedArticles.count || 0,
      };
    },
  });

  const statCards = [
    { title: "Total Articles", value: stats?.articles || 0, icon: FileText },
    { title: "Published Articles", value: stats?.publishedArticles || 0, icon: Eye },
    { title: "Categories", value: stats?.categories || 0, icon: FolderTree },
    { title: "Total Users", value: stats?.users || 0, icon: Users },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="bg-[#222222] border-[#333333]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-white">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-5 w-5 text-[#8E9196]" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};