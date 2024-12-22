import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { CategorySection } from "@/components/home/CategorySection";
import { TrendingSection } from "@/components/home/TrendingSection";

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