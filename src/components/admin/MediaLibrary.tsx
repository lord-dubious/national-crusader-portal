import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
  type?: 'image' | 'pdf';
  bucketName?: string;
}

export const MediaLibrary = ({ onSelect, type = 'image', bucketName = 'media' }: MediaLibraryProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const { data: mediaFiles, refetch } = useQuery({
    queryKey: ["media-files", bucketName],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from(bucketName)
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
      const fileName = `${file.name.split('.')[0]}_${Math.random()}.${fileExt}`;

      const { error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

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
        .from(bucketName)
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

  const handleSelect = (file: any) => {
    if (onSelect) {
      const url = supabase.storage.from(bucketName).getPublicUrl(file.name).data.publicUrl;
      onSelect(url);
    }
  };

  return (
    <Card className="bg-[#333333] border-[#444444]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Image className="h-5 w-5 text-white" />
          {type === 'pdf' ? 'PDF Library' : 'Media Library'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Input
            type="file"
            onChange={uploadFile}
            disabled={uploading}
            accept={type === 'pdf' ? "application/pdf" : "image/*"}
            className="bg-[#444444] border-[#555555] text-white file:bg-[#555555] file:text-white file:border-[#666666] hover:file:bg-[#DC2626] file:transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaFiles?.map((file) => (
            <div key={file.name} className="relative group">
              {type === 'pdf' ? (
                <div 
                  className="w-full aspect-square bg-[#444444] rounded-lg flex items-center justify-center cursor-pointer border border-[#444444] hover:border-[#DC2626] transition-colors"
                  onClick={() => handleSelect(file)}
                >
                  <span className="text-white">{file.name}</span>
                </div>
              ) : (
                <img
                  src={`${supabase.storage.from(bucketName).getPublicUrl(file.name).data.publicUrl}`}
                  alt={file.name}
                  className="w-full aspect-square object-cover rounded-lg cursor-pointer border border-[#444444] hover:border-[#DC2626] transition-colors"
                  onClick={() => handleSelect(file)}
                />
              )}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#DC2626] hover:bg-[#DC2626]/80"
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