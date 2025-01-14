import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { CategorySection } from "@/components/home/CategorySection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { NewspaperSection } from "@/components/home/NewspaperSection";
import { BreakingNewsTicker } from "@/components/home/BreakingNewsTicker";

export const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <BreakingNewsTicker />
      <FeaturedArticle />
      <TrendingSection />
      <CategorySection />
      <NewspaperSection />
    </div>
  );
};

export default Index;