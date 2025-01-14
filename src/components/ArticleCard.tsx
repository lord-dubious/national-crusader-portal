import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";

interface ArticleCardProps {
  category: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  slug?: string;
  tags?: { id: number; name: string; slug: string }[];
}

export const ArticleCard = ({ category, title, excerpt, imageUrl, slug, tags }: ArticleCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link 
      to={slug ? `/article/${slug}` : "#"} 
      className="block h-full"
    >
      <Card className="group h-full cursor-pointer animate-fade-up bg-primary dark:bg-[#333333] shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] relative">
        <CardContent className="p-0 h-full">
          <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
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
          <div className="p-8 flex flex-col h-[calc(100%-40%)] bg-transparent dark:bg-transparent group-hover:bg-[#F5F5F5] dark:group-hover:bg-[#444444] transition-colors duration-300">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-block rounded bg-accent/10 text-accent px-2.5 py-0.5 text-xs font-medium">
                {category}
              </span>
              {tags?.map((tag) => (
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
            <h3 className="text-xl font-semibold mb-3 text-[#111111] dark:text-[#F1F1F1] group-hover:text-accent transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="text-[#444444] dark:text-[#C8C8C9] line-clamp-3 text-sm flex-grow">
              {excerpt}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};