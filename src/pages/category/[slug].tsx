import { GetServerSideProps } from 'next';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

interface CategoryPageProps {
  category: any;
  articles: any[];
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params || {};

  const [categoryResponse, articlesResponse] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single(),
    supabase
      .from("articles")
      .select(`
        *,
        category:categories(name),
        author:profiles(username)
      `)
      .eq("category.slug", slug)
      .eq("status", "published")
      .order("published_at", { ascending: false })
  ]);

  if (categoryResponse.error || !categoryResponse.data) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      category: categoryResponse.data,
      articles: articlesResponse.data || []
    }
  };
};

const CategoryPage = ({ category, articles }: CategoryPageProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{category.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;