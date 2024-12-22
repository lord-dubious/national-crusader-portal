import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Clock } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const FeaturedArticle = () => {
  const { toast } = useToast();
  const { data: featuredArticle, error: featuredError } = useQuery({
    queryKey: ["featured-article"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(name)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching featured article",
          description: error.message
        });
        throw error;
      }
      return data;
    },
  });

  if (featuredError) return null;
  if (!featuredArticle) return null;

  return (
    <article className="relative h-[70vh] min-h-[600px] w-full overflow-hidden rounded-lg animate-fade-up">
      <img
        src={featuredArticle.featured_image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"}
        alt={featuredArticle.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="flex items-center space-x-4 mb-4">
          <span className="inline-block rounded bg-accent px-3 py-1 text-sm font-medium text-white">
            {featuredArticle.category?.name}
          </span>
          <span className="text-white/80 text-sm flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(featuredArticle.published_at).toLocaleDateString()}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-2xl">
          {featuredArticle.title}
        </h1>
        <p className="text-lg text-gray-200 mb-6 max-w-2xl">
          {featuredArticle.excerpt}
        </p>
        <Button 
          className="group bg-accent hover:bg-accent/90"
          asChild
        >
          <a href={`/article/${featuredArticle.slug}`}>
            Read More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </div>
    </article>
  );
};

const CategorySection = ({ categorySlug }: { categorySlug: string }) => {
  const { toast } = useToast();
  const { data: articles, error } = useQuery({
    queryKey: ["category-articles", categorySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(name)
        `)
        .eq("status", "published")
        .eq("category.slug", categorySlug)
        .order("published_at", { ascending: false })
        .limit(3);
      
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

  if (error) return null;
  if (!articles?.length) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">{articles[0]?.category?.name}</h2>
          <Button variant="ghost" asChild>
            <a href={`/category/${categorySlug}`} className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              category={article.category.name}
              title={article.title}
              excerpt={article.excerpt || ""}
              imageUrl={article.featured_image || ""}
              slug={article.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const TrendingSection = () => {
  const { toast } = useToast();
  const { data: trendingArticles, error } = useQuery({
    queryKey: ["trending-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(name)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(4);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching trending articles",
          description: error.message
        });
        throw error;
      }
      return data;
    },
  });

  if (error) return null;
  if (!trendingArticles?.length) return null;

  return (
    <section className="bg-muted py-12 animate-fade-up">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-accent mr-2" />
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <div className="h-1 bg-accent flex-grow ml-4 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingArticles.map((article, i) => (
            <a 
              key={article.id}
              href={`/article/${article.slug}`}
              className="flex items-start space-x-4 group cursor-pointer"
            >
              <span className="text-3xl font-bold text-accent">0{i + 1}</span>
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">
                  {article.category.name}
                </span>
                <h3 className="font-medium group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8 space-y-12">
          <FeaturedArticle />
          <CategorySection categorySlug="politics" />
          <TrendingSection />
          <CategorySection categorySlug="religion" />
          <CategorySection categorySlug="faith-culture" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;