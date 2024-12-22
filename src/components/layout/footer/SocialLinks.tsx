import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Facebook, Twitter, Instagram, Github, Youtube, Linkedin, type LucideIcon } from "lucide-react";

// Map of icon names to their components
const iconMap: Record<string, LucideIcon> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  github: Github,
  youtube: Youtube,
  linkedin: Linkedin,
};

export const SocialLinks = () => {
  const { data: socialLinks } = useQuery({
    queryKey: ["social-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .eq("is_active", true);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="flex justify-center space-x-6 py-6">
      {socialLinks?.map((link) => {
        const IconComponent = iconMap[link.icon.toLowerCase()];
        return IconComponent ? (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-foreground/70 hover:text-accent transition-colors"
          >
            <IconComponent className="h-5 w-5" />
            <span className="sr-only">{link.platform}</span>
          </a>
        ) : null;
      })}
    </div>
  );
};