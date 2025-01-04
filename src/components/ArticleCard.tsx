import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ArticleCardProps {
  category: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  slug?: string;
}

export const ArticleCard = ({ category, title, excerpt, imageUrl, slug }: ArticleCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
    console.error("Failed to load image:", imageUrl);
  };

  return (
    <Link 
      to={slug ? `/article/${slug}` : "#"} 
      className="block h-full"
    >
      <Card className="group h-full cursor-pointer animate-fade-up bg-primary dark:bg-[#333333] shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] will-change-transform">
        <CardContent className="p-0 h-full">
          <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
            <img
              src={imageError ? "/placeholder.svg" : imageUrl}
              alt={title}
              className={`h-full w-full object-cover transition-all duration-500 ${
                imageLoaded 
                  ? "opacity-100 scale-100 group-hover:scale-105" 
                  : "opacity-0 scale-95"
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
          </div>
          <div className="p-8 flex flex-col h-[calc(100%-40%)] bg-primary dark:bg-[#333333] group-hover:bg-[#F5F5F5] dark:group-hover:bg-[#444444] transition-colors duration-300">
            <span className="inline-block rounded bg-accent/10 text-accent px-2.5 py-0.5 text-xs font-medium mb-3">
              {category}
            </span>
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