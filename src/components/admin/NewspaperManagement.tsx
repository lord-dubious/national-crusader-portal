import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import { NewspaperUpload } from "./newspaper/NewspaperUpload";
import { NewspaperList } from "./newspaper/NewspaperList";

export const NewspaperManagement = () => {
  const { data: newspapers, refetch } = useQuery({
    queryKey: ["newspapers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newspapers")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="bg-[#222222] border-[#333333]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Newspaper className="h-5 w-5" />
          Newspaper Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NewspaperUpload onUploadSuccess={refetch} />
        <NewspaperList newspapers={newspapers || []} onUpdate={refetch} />
      </CardContent>
    </Card>
  );
};