import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MediaLibrary = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const { data: mediaFiles, refetch } = useQuery({
    queryKey: ["media-files"],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('media')
        .list();
      
      if (error) throw error;
      return data;
    },
  });

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (error) throw error;

      await refetch();
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully."
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

  const deleteFile = async (path: string) => {
    try {
      const { error } = await supabase.storage
        .from('media')
        .remove([path]);

      if (error) throw error;

      await refetch();
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully."
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Media Library
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Input
            type="file"
            onChange={uploadFile}
            disabled={uploading}
            accept="image/*"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaFiles?.map((file) => (
            <div key={file.name} className="relative group">
              <img
                src={`${supabase.storage.from('media').getPublicUrl(file.name).data.publicUrl}`}
                alt={file.name}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteFile(file.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};