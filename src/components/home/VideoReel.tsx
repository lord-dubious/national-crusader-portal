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

export const VideoReel = ({ categoryId, categoryName, categorySlug }: VideoReelProps) => {
  const { data: videos, isLoading } = useQuery({
    queryKey: ["category-videos", categoryId],
    queryFn: async () => {
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
    enabled: !!categoryId,
  });

  if (isLoading || !videos?.length) {
    console.log("No videos found or still loading for category:", categoryId);
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
                    src={video.featured_image || "/placeholder.svg"}
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