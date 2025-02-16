
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Upload, Trash2, FileText, Upload as UploadIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
}

export const MediaLibrary = ({ onSelect }: MediaLibraryProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const { data: mediaFiles, refetch: refetchMedia } = useQuery({
    queryKey: ["media-files"],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('media')
        .list();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: pdfFiles, refetch: refetchPdfs } = useQuery({
    queryKey: ["pdf-files"],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('pdf_newspapers')
        .list();
      
      if (error) throw error;
      return data;
    },
  });

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>, bucket: 'media' | 'pdf_newspapers') => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type for PDFs
      if (bucket === 'pdf_newspapers' && file.type !== 'application/pdf') {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload only PDF files in this section"
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      if (bucket === 'media') {
        await refetchMedia();
      } else {
        await refetchPdfs();
      }
      
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

  const deleteFile = async (path: string, bucket: 'media' | 'pdf_newspapers') => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;

      if (bucket === 'media') {
        await refetchMedia();
      } else {
        await refetchPdfs();
      }

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

  const handleSelect = (file: any, bucket: 'media' | 'pdf_newspapers') => {
    if (onSelect) {
      const url = supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl;
      onSelect(url);
    }
  };

  return (
    <Card className="bg-[#333333] border-[#444444]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Image className="h-5 w-5 text-white" />
          Media Library
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="images" className="space-y-4">
          <TabsList className="bg-[#444444]">
            <TabsTrigger value="images" className="data-[state=active]:bg-[#DC2626]">
              Images
            </TabsTrigger>
            <TabsTrigger value="pdfs" className="data-[state=active]:bg-[#DC2626]">
              PDF Newspapers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images">
            <div className="mb-6">
              <Input
                type="file"
                onChange={(e) => uploadFile(e, 'media')}
                disabled={uploading}
                accept="image/*"
                className="bg-[#444444] border-[#555555] text-white file:bg-[#555555] file:text-white file:border-[#666666] hover:file:bg-[#DC2626] file:transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaFiles?.map((file) => (
                <div key={file.name} className="relative group">
                  <img
                    src={`${supabase.storage.from('media').getPublicUrl(file.name).data.publicUrl}`}
                    alt={file.name}
                    className="w-full aspect-square object-cover rounded-lg cursor-pointer border border-[#444444] hover:border-[#DC2626] transition-colors"
                    onClick={() => handleSelect(file, 'media')}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#DC2626] hover:bg-[#DC2626]/80"
                    onClick={() => deleteFile(file.name, 'media')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pdfs">
            <div className="mb-6">
              <Input
                type="file"
                onChange={(e) => uploadFile(e, 'pdf_newspapers')}
                disabled={uploading}
                accept=".pdf"
                className="bg-[#444444] border-[#555555] text-white file:bg-[#555555] file:text-white file:border-[#666666] hover:file:bg-[#DC2626] file:transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pdfFiles?.map((file) => (
                <div key={file.name} className="relative group bg-[#444444] p-4 rounded-lg border border-[#555555] hover:border-[#DC2626] transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-white" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white truncate">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {(file.metadata?.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-[#DC2626]/20"
                        onClick={() => handleSelect(file, 'pdf_newspapers')}
                      >
                        <UploadIcon className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-[#DC2626]/20"
                        onClick={() => deleteFile(file.name, 'pdf_newspapers')}
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
