import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BreakingNewsTicker } from "@/components/home/BreakingNewsTicker";

// Lazy load components for better initial load performance
const FeaturedArticle = lazy(() => import("@/components/home/FeaturedArticle").then(mod => ({ default: mod.FeaturedArticle })));
const TrendingSection = lazy(() => import("@/components/home/TrendingSection").then(mod => ({ default: mod.TrendingSection })));
const NewspaperSection = lazy(() => import("@/components/home/NewspaperSection").then(mod => ({ default: mod.NewspaperSection })));
const CategorySection = lazy(() => import("@/components/home/CategorySection").then(mod => ({ default: mod.CategorySection })));
const TrendingTags = lazy(() => import("@/components/home/TrendingTags").then(mod => ({ default: mod.TrendingTags })));

const Index = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      console.log("Fetching categories");
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="mt-16"> {/* Add margin-top to account for fixed header height */}
        <BreakingNewsTicker />
      </div>
      <main className="flex-1">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <Suspense 
              fallback={
                <Skeleton className="h-[70vh] w-full rounded-lg animate-pulse" />
              }
            >
              <FeaturedArticle />
            </Suspense>
          </div>
          
          <div className="py-8">
            <Suspense 
              fallback={
                <Skeleton className="h-20 w-full rounded-lg animate-pulse" />
              }
            >
              <TrendingTags />
            </Suspense>
          </div>

          <div className="py-12">
            <Suspense 
              fallback={
                <Skeleton className="h-96 w-full rounded-lg animate-pulse" />
              }
            >
              <TrendingSection />
            </Suspense>
          </div>

          <Suspense 
            fallback={
              <Skeleton className="h-96 w-full rounded-lg animate-pulse" />
            }
          >
            <NewspaperSection />
          </Suspense>

          <div className="space-y-16 py-8">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton 
                  key={i} 
                  className="h-96 w-full rounded-lg animate-pulse" 
                />
              ))
            ) : (
              categories?.map((category) => (
                <Suspense 
                  key={category.id} 
                  fallback={
                    <Skeleton className="h-96 w-full rounded-lg animate-pulse" />
                  }
                >
                  <CategorySection categorySlug={category.slug} />
                </Suspense>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;