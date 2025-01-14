import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GetServerSideProps } from 'next';
import { supabase } from "@/integrations/supabase/client";
import { BreakingNewsTicker } from "@/components/home/BreakingNewsTicker";
import dynamic from 'next/dynamic';

// Dynamic imports for better code splitting
const FeaturedArticle = dynamic(() => import("@/components/home/FeaturedArticle").then(mod => ({ default: mod.FeaturedArticle })), {
  loading: () => <Skeleton className="h-[70vh] w-full rounded-lg animate-pulse" />
});

const TrendingSection = dynamic(() => import("@/components/home/TrendingSection").then(mod => ({ default: mod.TrendingSection })), {
  loading: () => <Skeleton className="h-96 w-full rounded-lg animate-pulse" />
});

const NewspaperSection = dynamic(() => import("@/components/home/NewspaperSection").then(mod => ({ default: mod.NewspaperSection })), {
  loading: () => <Skeleton className="h-96 w-full rounded-lg animate-pulse" />
});

const CategorySection = dynamic(() => import("@/components/home/CategorySection").then(mod => ({ default: mod.CategorySection })), {
  loading: () => <Skeleton className="h-96 w-full rounded-lg animate-pulse" />
});

const TrendingTags = dynamic(() => import("@/components/home/TrendingTags").then(mod => ({ default: mod.TrendingTags })), {
  loading: () => <Skeleton className="h-20 w-full rounded-lg animate-pulse" />
});

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return {
      props: {
        categories: []
      }
    };
  }

  return {
    props: {
      categories: categories || []
    }
  };
};

interface HomePageProps {
  categories: any[];
}

const HomePage = ({ categories }: HomePageProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BreakingNewsTicker />
      <main className="flex-1">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <Suspense fallback={<Skeleton className="h-[70vh] w-full rounded-lg animate-pulse" />}>
              <FeaturedArticle />
            </Suspense>
          </div>
          
          <div className="py-8">
            <Suspense fallback={<Skeleton className="h-20 w-full rounded-lg animate-pulse" />}>
              <TrendingTags />
            </Suspense>
          </div>

          <div className="py-12">
            <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg animate-pulse" />}>
              <TrendingSection />
            </Suspense>
          </div>

          <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg animate-pulse" />}>
            <NewspaperSection />
          </Suspense>

          <div className="space-y-16 py-8">
            {categories?.map((category) => (
              <Suspense key={category.id} fallback={<Skeleton className="h-96 w-full rounded-lg animate-pulse" />}>
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

export default HomePage;