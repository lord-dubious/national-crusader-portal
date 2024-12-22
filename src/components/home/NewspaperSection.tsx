import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HTMLFlipBook } from "react-pageflip";
import { Newspaper } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const NewspaperSection = () => {
  const [selectedNewspaper, setSelectedNewspaper] = useState<string | null>(null);

  const { data: newspapers } = useQuery({
    queryKey: ["published-newspapers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newspapers")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-12 bg-[#222222]">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Newspaper className="h-6 w-6 text-[#DC2626] mr-2" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Digital Newspapers</h2>
        </div>

        <div className="mb-6">
          <Select
            value={selectedNewspaper || ""}
            onValueChange={(value) => setSelectedNewspaper(value)}
          >
            <SelectTrigger className="w-full md:w-[300px] bg-[#333333] border-[#444444] text-white">
              <SelectValue placeholder="Select a newspaper" />
            </SelectTrigger>
            <SelectContent className="bg-[#333333] border-[#444444]">
              {newspapers?.map((newspaper) => (
                <SelectItem
                  key={newspaper.id}
                  value={newspaper.pdf_url}
                  className="text-white hover:bg-[#444444]"
                >
                  {newspaper.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedNewspaper && (
          <div className="aspect-[3/2] bg-[#333333] rounded-lg overflow-hidden">
            <iframe
              src={`${selectedNewspaper}#toolbar=0`}
              className="w-full h-full"
              title="PDF Viewer"
            />
          </div>
        )}
      </div>
    </section>
  );
};