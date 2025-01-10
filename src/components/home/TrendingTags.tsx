import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const TrendingTags = () => {
  const { toast } = useToast();
  
  const { data: trendingTags, isLoading } = useQuery({
    queryKey: ["trending-tags"],
    queryFn: async () => {
      console.log("Fetching trending tags");
      const { data, error } = await supabase
        .from('article_tags')
        .select(`
          tags (
            id,
            name,
            slug
          ),
          count: count(*)
        `)
        .select('tags!inner(*)')
        .order('count', { ascending: false })
        .limit(10);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching trending tags",
          description: error.message
        });
        throw error;
      }

      // Transform and filter the data
      return data
        .map(item => ({
          ...item.tags,
          count: item.count
        }))
        .filter(tag => tag.id !== null);
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading || !trendingTags?.length) return null;

  return (
    <section className="bg-background py-8">
      <div className="container mx-auto">
        <div className="flex items-center mb-6">
          <Tag className="h-5 w-5 text-accent mr-2" />
          <h2 className="text-xl font-semibold">Trending Tags</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <Link key={tag.id} to={`/tag/${tag.slug}`}>
              <Badge 
                variant="secondary" 
                className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              >
                {tag.name}
                <span className="ml-1 text-xs text-muted-foreground">
                  ({tag.count})
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};