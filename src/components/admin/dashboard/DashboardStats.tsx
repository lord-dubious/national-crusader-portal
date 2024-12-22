import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, FolderTree } from "lucide-react";

export const DashboardStats = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [articles, categories, users] = await Promise.all([
        supabase.from("articles").select("*", { count: "exact" }),
        supabase.from("categories").select("*", { count: "exact" }),
        supabase.from("users").select("*", { count: "exact" }),
      ]);

      return {
        articles: articles.count || 0,
        categories: categories.count || 0,
        users: users.count || 0,
      };
    },
  });

  const statCards = [
    { title: "Total Articles", value: stats?.articles || 0, icon: FileText },
    { title: "Categories", value: stats?.categories || 0, icon: FolderTree },
    { title: "Users", value: stats?.users || 0, icon: Users },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="bg-primary-foreground/10 border-primary-foreground/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-primary-foreground text-lg font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-5 w-5 text-primary-foreground/70" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary-foreground">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};