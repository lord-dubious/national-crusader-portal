import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";

interface ArticleCardProps {
  category: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  slug?: string;
  tags?: { id: number; name: string; slug: string }[];
  size?: "small" | "medium" | "large";
  publishedAt?: string | null;
  content?: string;
}

const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content?.split(/\s+/).length || 0;
  return Math.ceil(words / wordsPerMinute);
};

export const ArticleCard = ({ 
  category, 
  title, 
  excerpt, 
  imageUrl, 
  slug, 
  tags,
  size = "medium",
  publishedAt,
  content = ""
}: ArticleCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const readTime = calculateReadTime(content);

  const timeAgo = publishedAt 
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
    : null;

  const cardStyles = {
    small: {
      container: "flex gap-4 h-32",
      image: "w-32 h-32",
      content: "flex-1 p-3",
      title: "text-sm font-medium line-clamp-2",
      excerpt: "hidden",
      metadata: "text-[9px] sm:text-[10px]", // Made even smaller
    },
    medium: {
      container: "h-full",
      image: "aspect-[16/10] w-full",
      content: "p-6",
      title: "text-xl font-semibold line-clamp-2",
      excerpt: "line-clamp-3",
      metadata: "text-xs",
    },
    large: {
      container: "h-full",
      image: "aspect-[16/9] w-full",
      content: "p-8",
      title: "text-2xl md:text-3xl font-bold line-clamp-3",
      excerpt: "line-clamp-3",
      metadata: "text-sm",
    },
  };

  const styles = cardStyles[size];

  return (
    <Link 
      to={slug ? `/article/${slug}` : "#"} 
      className="block h-full"
    >
      <Card className={`group cursor-pointer animate-fade-up bg-primary dark:bg-[#333333] shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] relative ${styles.container}`}>
        <CardContent className={`p-0 h-full ${size === 'small' ? 'flex' : ''}`}>
          <div className={`overflow-hidden bg-muted ${styles.image}`}>
            <picture>
              <source
                media="(min-width: 1920px)"
                srcSet={`${imageUrl}?w=1920&format=webp&quality=80`}
                type="image/webp"
              />
              <source
                media="(min-width: 1200px)"
                srcSet={`${imageUrl}?w=1200&format=webp&quality=80`}
                type="image/webp"
              />
              <source
                media="(min-width: 828px)"
                srcSet={`${imageUrl}?w=828&format=webp&quality=80`}
                type="image/webp"
              />
              <source
                media="(min-width: 640px)"
                srcSet={`${imageUrl}?w=640&format=webp&quality=80`}
                type="image/webp"
              />
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={title}
                className={`h-full w-full object-cover transition-all duration-500 ${
                  imageLoaded 
                    ? 'opacity-100 scale-100 group-hover:scale-105' 
                    : 'opacity-0 scale-95'
                }`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            </picture>
          </div>
          <div className={`${styles.content} flex flex-col justify-between`}>
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-block rounded bg-accent/10 text-accent px-2.5 py-0.5 text-xs font-medium">
                  {category}
                </span>
                {size !== 'small' && tags?.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/tag/${tag.slug}`}
                    className="inline-block rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-0.5 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
              <h3 className={`${styles.title} text-[#111111] dark:text-[#F1F1F1] group-hover:text-accent transition-colors mb-2`}>
                {title}
              </h3>
              {styles.excerpt !== "hidden" && (
                <p className="text-[#444444] dark:text-[#C8C8C9] text-sm flex-grow mb-2">
                  {excerpt}
                </p>
              )}
            </div>
            <div className={`flex items-center gap-1.5 ${styles.metadata} text-[#666666] dark:text-[#999999]`}>
              {timeAgo && (
                <time>{timeAgo}</time>
              )}
              <div className="flex items-center gap-1">
                <Clock className={`w-${size === 'small' ? '2' : '3'} h-${size === 'small' ? '2' : '3'}`} />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};