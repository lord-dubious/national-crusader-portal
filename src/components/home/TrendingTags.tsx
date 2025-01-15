import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface TagWithArticles {
  id: number;
  name: string;
  slug: string;
  articles: {
    id: number;
    title: string;
    featured_image: string | null;
    slug: string;
  }[];
}

export const TrendingTags = () => {
  const { toast } = useToast();
  
  const { data: trendingTags, isLoading } = useQuery({
    queryKey: ["trending-tags-with-articles"],
    queryFn: async () => {
      console.log("Fetching trending tags with articles");
      const { data: tagData, error: tagError } = await supabase
        .from('article_tags')
        .select(`
          tag:tags!inner (
            id,
            name,
            slug
          ),
          article:articles!inner (
            id,
            title,
            featured_image,
            slug,
            published_at
          )
        `)
        .order('published_at', { foreignTable: 'articles', ascending: false });
      
      if (tagError) {
        console.error("Error fetching trending tags:", tagError);
        toast({
          variant: "destructive",
          title: "Error fetching trending tags",
          description: tagError.message
        });
        throw tagError;
      }

      // Transform and aggregate the data
      const tagMap = new Map<number, TagWithArticles>();
      
      tagData?.forEach(item => {
        const { tag, article } = item;
        if (!tagMap.has(tag.id)) {
          tagMap.set(tag.id, {
            ...tag,
            articles: []
          });
        }
        
        const tagEntry = tagMap.get(tag.id)!;
        if (tagEntry.articles.length < 3) { // Keep only 3 most recent articles per tag
          tagEntry.articles.push(article);
        }
      });

      // Convert to array and sort by number of articles
      return Array.from(tagMap.values())
        .sort((a, b) => b.articles.length - a.articles.length)
        .slice(0, 6); // Keep top 6 tags
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || !trendingTags?.length) return null;

  return (
    <section className="bg-background py-8">
      <div className="container mx-auto">
        <div className="flex items-center mb-6">
          <Tag className="h-5 w-5 text-accent mr-2" />
          <h2 className="text-xl font-semibold">Trending Topics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingTags.map((tag) => (
            <Card key={tag.id} className="p-4">
              <Link 
                to={`/tag/${tag.slug}`}
                className="inline-block mb-4"
              >
                <Badge 
                  variant="secondary" 
                  className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-lg px-4 py-2"
                >
                  #{tag.name}
                </Badge>
              </Link>
              <div className="space-y-4">
                {tag.articles.map((article) => (
                  <Link 
                    key={article.id} 
                    to={`/article/${article.slug}`}
                    className="flex items-center gap-3 group"
                  >
                    {article.featured_image && (
                      <img 
                        src={article.featured_image} 
                        alt={article.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <h3 className="text-sm font-medium group-hover:text-accent transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};