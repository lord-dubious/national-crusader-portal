import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Newspaper, Upload, Trash2, Archive, Eye, EyeOff } from "lucide-react";

export const NewspaperManagement = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");

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

  const uploadPDF = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      if (!title.trim()) {
        toast({
          variant: "destructive",
          title: "Title required",
          description: "Please enter a title for the newspaper."
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('newspapers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('newspapers')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('newspapers')
        .insert({
          title: title,
          pdf_url: publicUrl,
          status: 'published'
        });

      if (dbError) throw dbError;

      await refetch();
      setTitle("");
      toast({
        title: "PDF uploaded",
        description: "Your newspaper has been uploaded successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  const updateStatus = async (id: number, status: 'published' | 'archived' | 'hidden') => {
    try {
      const { error } = await supabase
        .from('newspapers')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      await refetch();
      toast({
        title: "Status updated",
        description: `Newspaper has been ${status}.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message
      });
    }
  };

  const deletePDF = async (id: number) => {
    try {
      const { error } = await supabase
        .from('newspapers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await refetch();
      toast({
        title: "PDF deleted",
        description: "The newspaper has been deleted successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message
      });
    }
  };

  return (
    <Card className="bg-[#222222] border-[#333333]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Newspaper className="h-5 w-5" />
          Newspaper Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <Input
            type="text"
            placeholder="Enter newspaper title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#333333] border-[#444444] text-white"
          />
          <Input
            type="file"
            onChange={uploadPDF}
            disabled={uploading}
            accept="application/pdf"
            className="bg-[#333333] border-[#444444] text-white file:bg-[#444444] file:text-white file:border-[#555555] hover:file:bg-[#DC2626] file:transition-colors"
          />
        </div>
        <div className="space-y-4">
          {newspapers?.map((newspaper) => (
            <div
              key={newspaper.id}
              className="flex items-center justify-between p-4 bg-[#333333] rounded-lg"
            >
              <div className="flex-1">
                <h3 className="text-white font-medium">{newspaper.title}</h3>
                <p className="text-sm text-gray-400">
                  Status: {newspaper.status}
                </p>
              </div>
              <div className="flex gap-2">
                {newspaper.status !== 'published' && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateStatus(newspaper.id, 'published')}
                    className="bg-[#444444] border-[#555555] hover:bg-[#DC2626] text-white"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {newspaper.status === 'published' && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateStatus(newspaper.id, 'hidden')}
                    className="bg-[#444444] border-[#555555] hover:bg-[#DC2626] text-white"
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateStatus(newspaper.id, 'archived')}
                  className="bg-[#444444] border-[#555555] hover:bg-[#DC2626] text-white"
                >
                  <Archive className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deletePDF(newspaper.id)}
                  className="bg-[#DC2626] hover:bg-[#DC2626]/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};