import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Play, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface VideoArticle {
  id: number;
  title: string;
  slug: string;
  video_url: string;
  featured_image: string | null;
  category: {
    name: string;
    slug: string;
  } | null;
}

interface VideoReelProps {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
}

const getVideoThumbnail = (videoUrl: string) => {
  // YouTube thumbnail extraction
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = videoUrl.match(youtubeRegex);
  
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
  }
  
  // Vimeo thumbnail extraction (would require an API call in a real implementation)
  const vimeoRegex = /vimeo\.com\/(\d+)/;
  const vimeoMatch = videoUrl.match(vimeoRegex);
  
  if (vimeoMatch) {
    // For now, return a placeholder. In a real app, you'd want to fetch the actual thumbnail
    return "https://source.unsplash.com/random/800x600?video";
  }
  
  // Default thumbnail for other video URLs
  return "https://source.unsplash.com/random/800x600?video";
};

export const VideoReel = ({ categoryId, categoryName, categorySlug }: VideoReelProps) => {
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ["category-videos", categoryId],
    queryFn: async () => {
      if (!categoryId) {
        console.log("No category ID provided");
        return [];
      }

      console.log("Fetching video articles for category:", categoryId);
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          video_url,
          featured_image,
          category:categories(name, slug)
        `)
        .eq("category_id", categoryId)
        .eq("has_video", true)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching video articles:", error);
        throw error;
      }

      console.log("Fetched video articles:", data);
      return data as VideoArticle[];
    },
    enabled: Boolean(categoryId),
    retry: 2,
  });

  // If there's an error or no videos, don't render anything
  if (error || !videos?.length) {
    console.log("No videos found or error occurred for category:", categoryId);
    return null;
  }

  // Don't render loading state to avoid layout shifts
  if (isLoading) {
    return null;
  }

  return (
    <div className="py-8 first:pt-0 last:pb-0">
      <div className="relative bg-[#EBEBEB] dark:bg-[#222222] shadow-lg rounded-xl p-8 overflow-hidden border border-[#D1D1D1] dark:border-[#333333]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold tracking-tight text-[#111111] dark:text-[#F1F1F1]">
              {categoryName} Videos
            </h2>
            <div className="h-1 w-16 bg-accent rounded hidden sm:block" />
          </div>
          <Button variant="ghost" size="sm" asChild className="group hover:text-accent">
            <Link to={`/category/${categorySlug}`}>
              View All
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4">
            {videos.map((video) => (
              <Link
                key={video.id}
                to={`/article/${video.slug}`}
                className="relative group flex-none w-[250px] overflow-hidden rounded-lg"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    src={video.featured_image || getVideoThumbnail(video.video_url)}
                    alt={video.title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium line-clamp-2 text-[#111111] dark:text-[#F1F1F1] group-hover:text-accent transition-colors">
                    {video.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          <ScrollBar 
            orientation="horizontal" 
            className="flex h-2.5 bg-transparent transition-colors ease-out hover:bg-border/50 data-[state=visible]:bg-border/50" 
          />
        </ScrollArea>
      </div>
    </div>
  );
};