import { GetServerSideProps } from 'next';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ArticlePageProps {
  article: any;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params || {};

  const { data: article, error } = await supabase
    .from("articles")
    .select(`
      *,
      category:categories(name),
      author:profiles(username, email)
    `)
    .eq("slug", slug)
    .single();

  if (error || !article) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      article
    }
  };
};

const ArticlePage = ({ article }: ArticlePageProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <article className="container mx-auto px-4 py-8">
          {article?.featured_image && (
            <div className="relative h-[50vh] mb-8 rounded-lg overflow-hidden">
              <img
                src={article.featured_image}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{article?.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{article?.category?.name}</span>
                <span>•</span>
                <span>By {article?.author?.username || 'Anonymous'}</span>
                <span>•</span>
                <time>
                  {article?.published_at &&
                    format(new Date(article.published_at), "MMMM d, yyyy")}
                </time>
              </div>
            </div>
            <div 
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground ProseMirror"
              dangerouslySetInnerHTML={{ __html: article?.content || "" }}
            />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;