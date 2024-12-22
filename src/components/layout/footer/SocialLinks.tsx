import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as Icons from "lucide-react";

type IconName = keyof typeof Icons;

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
        // Ensure the icon exists in Lucide icons
        const IconComponent = Icons[link.icon as IconName];
        return IconComponent ? (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            <IconComponent className="h-5 w-5" />
            <span className="sr-only">{link.platform}</span>
          </a>
        ) : null;
      })}
    </div>
  );
};