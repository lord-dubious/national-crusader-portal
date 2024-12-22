import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as Icons from "lucide-react";

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
        const Icon = Icons[link.icon as keyof typeof Icons];
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{link.platform}</span>
          </a>
        );
      })}
    </div>
  );
};