import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { CategorySection } from "@/components/home/CategorySection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { NewspaperSection } from "@/components/home/NewspaperSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <FeaturedArticle />
          </div>
          <div className="py-12">
            <TrendingSection />
          </div>
          <NewspaperSection />
          <div className="space-y-16 py-8">
            {categories?.map((category) => (
              <CategorySection key={category.id} categorySlug={category.slug} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;