import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { TrendingSection } from "@/components/home/TrendingSection";
import { CategorySection } from "@/components/home/CategorySection";
import { NewspaperSection } from "@/components/home/NewspaperSection";

export const Home = () => {
  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      <FeaturedArticle />
      <TrendingSection />
      <CategorySection categorySlug="politics" />
      <CategorySection categorySlug="business" />
      <NewspaperSection />
    </main>
  );
};