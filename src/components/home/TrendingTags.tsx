import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface TagWithCount {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export const TrendingTags = () => {
  const { toast } = useToast();
  
  const { data: trendingTags, isLoading } = useQuery({
    queryKey: ["trending-tags"],
    queryFn: async () => {
      console.log("Fetching trending tags");
      const { data, error } = await supabase
        .from('article_tags')
        .select(`
          tag_id,
          tags!inner (
            id,
            name,
            slug
          )
        `)
        .order('tag_id', { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching trending tags",
          description: error.message
        });
        throw error;
      }

      // Transform the data to count tag occurrences
      const tagCounts = data.reduce((acc: { [key: string]: TagWithCount }, curr) => {
        const tag = curr.tags;
        if (!acc[tag.id]) {
          acc[tag.id] = {
            ...tag,
            count: 1
          };
        } else {
          acc[tag.id].count += 1;
        }
        return acc;
      }, {});

      // Convert to array and sort by count
      return Object.values(tagCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
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