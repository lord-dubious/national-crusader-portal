import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FeaturedArticle = () => (
  <article className="relative h-[70vh] min-h-[600px] w-full overflow-hidden rounded-lg animate-fade-up">
    <img
      src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"
      alt="Featured Article"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <span className="inline-block rounded bg-accent px-3 py-1 text-sm font-medium text-white mb-4">
        Politics
      </span>
      <h1 className="text-4xl font-bold text-white mb-4 max-w-2xl">
        The Future of Democracy in the Digital Age
      </h1>
      <p className="text-lg text-gray-200 mb-6 max-w-2xl">
        Exploring how technology is reshaping political discourse and democratic institutions
        in the modern era.
      </p>
      <Button className="group bg-accent hover:bg-accent/90">
        Read More
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  </article>
);

const ArticleCard = ({ category, title, excerpt }: { category: string; title: string; excerpt: string }) => (
  <article className="group cursor-pointer animate-fade-up">
    <div className="aspect-video w-full overflow-hidden rounded-lg mb-4">
      <img
        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"
        alt={title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <span className="inline-block rounded bg-accent/10 text-accent px-2.5 py-0.5 text-xs font-medium mb-2">
      {category}
    </span>
    <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
      {title}
    </h2>
    <p className="text-muted-foreground">{excerpt}</p>
  </article>
);

const TrendingSection = () => (
  <section className="bg-muted py-12 animate-fade-up">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        Trending Now
        <div className="h-1 bg-accent flex-grow ml-4 rounded" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start space-x-4">
            <span className="text-3xl font-bold text-accent">0{i}</span>
            <div>
              <span className="text-xs text-muted-foreground mb-1 block">Technology</span>
              <h3 className="font-medium hover:text-accent transition-colors cursor-pointer">
                AI Revolution: The Next Big Leap in Computing
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8 space-y-12">
          <FeaturedArticle />
          
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              Latest Stories
              <div className="h-1 bg-accent flex-grow ml-4 rounded" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ArticleCard
                category="Technology"
                title="The Rise of Artificial Intelligence in Modern Healthcare"
                excerpt="How AI is transforming the medical industry and improving patient care through innovative solutions."
              />
              <ArticleCard
                category="Business"
                title="Global Markets Face New Challenges"
                excerpt="Analysis of the current economic climate and its impact on international trade relations."
              />
              <ArticleCard
                category="Culture"
                title="The Evolution of Contemporary Art"
                excerpt="Exploring new trends and movements in the global art scene and their cultural significance."
              />
            </div>
          </section>

          <TrendingSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;