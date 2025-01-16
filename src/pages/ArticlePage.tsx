import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { format } from "date-fns";

const ArticlePage = () => {
  const { slug } = useParams();

  const { data: article } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(name),
          author:profiles(username, email)
        `)
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const getVideoEmbedUrl = (videoUrl: string) => {
    if (!videoUrl) return '';
    
    // YouTube URL transformations
    const youtubePatterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      /^[A-Za-z0-9_-]{11}$/
    ];

    for (const pattern of youtubePatterns) {
      const match = videoUrl.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    
    // Vimeo URL transformation
    const vimeoMatch = videoUrl.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    // If it's already an embed URL, return as is
    if (videoUrl.includes('/embed/')) {
      return videoUrl;
    }
    
    // Return original URL if no patterns match
    return videoUrl;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <article className="container mx-auto px-4 py-8">
          {article?.has_video && article?.video_url ? (
            <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden bg-black">
              <iframe
                src={getVideoEmbedUrl(article.video_url)}
                className="absolute inset-0 w-full h-full"
                title={article.title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                loading="lazy"
              />
            </div>
          ) : article?.featured_image ? (
            <div className="relative h-[50vh] mb-8 rounded-lg overflow-hidden">
              <img
                src={article.featured_image}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ) : null}
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{article?.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                {article?.category?.name && (
                  <>
                    <span>{article.category.name}</span>
                    <span>•</span>
                  </>
                )}
                <span>By {article?.author?.username || 'Anonymous'}</span>
                {article?.published_at && (
                  <>
                    <span>•</span>
                    <time>
                      {format(new Date(article.published_at), "MMMM d, yyyy")}
                    </time>
                  </>
                )}
              </div>
            </div>

            {/* Article excerpt if available */}
            {article?.excerpt && (
              <div className="mb-8 text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
                {article.excerpt}
              </div>
            )}

            {/* Main article content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground prose-img:rounded-lg prose-img:my-8 ProseMirror"
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