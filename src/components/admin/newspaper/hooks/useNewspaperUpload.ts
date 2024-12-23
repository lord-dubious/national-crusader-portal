import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useNewspaperUpload = (onUploadSuccess: () => void) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadNewspaper = async (title: string, file: File) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      toast({
        title: "Upload started",
        description: "Uploading PDF file..."
      });

      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      // Upload file using Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('newspapers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('newspapers')
        .getPublicUrl(filePath);

      // Insert into database
      const { error: dbError } = await supabase
        .from('newspapers')
        .insert({
          title: title,
          pdf_url: publicUrl,
          status: 'published'
        });

      if (dbError) throw dbError;

      onUploadSuccess();
      
      toast({
        title: "Upload complete",
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
      setUploadProgress(0);
    }
  };

  return {
    uploading,
    uploadProgress,
    setUploadProgress,
    uploadNewspaper
  };
};