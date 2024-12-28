import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { CategorySection } from "@/components/home/CategorySection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { NewspaperSection } from "@/components/home/NewspaperSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id,name,slug")
        .order("name");
      
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4">
          <div className="py-4 md:py-8">
            <Suspense fallback={<Skeleton className="h-[50vh] md:h-[70vh] w-full rounded-lg" />}>
              <FeaturedArticle />
            </Suspense>
          </div>
          <div className="py-8 md:py-12">
            <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
              <TrendingSection />
            </Suspense>
          </div>
          <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
            <NewspaperSection />
          </Suspense>
          <div className="space-y-8 md:space-y-16 py-4 md:py-8">
            {categories?.map((category) => (
              <Suspense key={category.id} fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
                <CategorySection categorySlug={category.slug} />
              </Suspense>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;