import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FeaturedArticle = () => (
  <article className="relative h-[70vh] min-h-[600px] w-full overflow-hidden rounded-lg animate-fade-up">
    <img
      src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"
      alt="Featured Article"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <div className="flex items-center space-x-4 mb-4">
        <span className="inline-block rounded bg-accent px-3 py-1 text-sm font-medium text-white">
          Politics
        </span>
        <span className="text-white/80 text-sm flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          5 hours ago
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-2xl">
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

const ArticleCard = ({ category, title, excerpt, imageUrl }: { 
  category: string; 
  title: string; 
  excerpt: string;
  imageUrl: string;
}) => (
  <Card className="group cursor-pointer animate-fade-up hover:shadow-lg transition-all duration-300">
    <CardContent className="p-0">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <span className="inline-block rounded bg-accent/10 text-accent px-2.5 py-0.5 text-xs font-medium mb-2">
          {category}
        </span>
        <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-2">
          {title}
        </h2>
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
      </div>
    </CardContent>
  </Card>
);

const TrendingSection = () => (
  <section className="bg-muted py-12 animate-fade-up">
    <div className="container mx-auto px-4">
      <div className="flex items-center mb-6">
        <TrendingUp className="h-6 w-6 text-accent mr-2" />
        <h2 className="text-2xl font-bold">Trending Now</h2>
        <div className="h-1 bg-accent flex-grow ml-4 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start space-x-4 group cursor-pointer">
            <span className="text-3xl font-bold text-accent">0{i}</span>
            <div>
              <span className="text-xs text-muted-foreground mb-1 block">Technology</span>
              <h3 className="font-medium group-hover:text-accent transition-colors">
                AI Revolution: The Next Big Leap in Computing
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CategorySection = ({ title, articles }: { title: string; articles: any[] }) => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <div className="flex items-center mb-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="h-1 bg-accent flex-grow ml-4 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <ArticleCard
            key={index}
            category={article.category}
            title={article.title}
            excerpt={article.excerpt}
            imageUrl={article.imageUrl}
          />
        ))}
      </div>
    </div>
  </section>
);

const Index = () => {
  const latestArticles = [
    {
      category: "Technology",
      title: "The Rise of Artificial Intelligence in Modern Healthcare",
      excerpt: "How AI is transforming the medical industry and improving patient care through innovative solutions.",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80"
    },
    {
      category: "Business",
      title: "Global Markets Face New Challenges",
      excerpt: "Analysis of the current economic climate and its impact on international trade relations.",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"
    },
    {
      category: "Culture",
      title: "The Evolution of Contemporary Art",
      excerpt: "Exploring new trends and movements in the global art scene and their cultural significance.",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80"
    }
  ];

  const politicsArticles = [
    {
      category: "Politics",
      title: "New Legislative Reforms Spark Debate",
      excerpt: "Recent policy changes have ignited discussions across party lines about the future of governance.",
      imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80"
    },
    {
      category: "Politics",
      title: "International Relations in Focus",
      excerpt: "Global leaders gather to address pressing challenges in diplomatic relations and cooperation.",
      imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80"
    },
    {
      category: "Politics",
      title: "Local Government Initiatives",
      excerpt: "Communities see positive impact from new municipal programs and developments.",
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8 space-y-12">
          <FeaturedArticle />
          <CategorySection title="Latest Stories" articles={latestArticles} />
          <TrendingSection />
          <CategorySection title="Politics" articles={politicsArticles} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;