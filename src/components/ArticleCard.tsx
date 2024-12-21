import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ArticleCardProps {
  category: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  slug?: string;
}

export const ArticleCard = ({ category, title, excerpt, imageUrl, slug }: ArticleCardProps) => (
  <Link to={slug ? `/article/${slug}` : "#"}>
    <Card className="group cursor-pointer animate-fade-up hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
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
  </Link>
);