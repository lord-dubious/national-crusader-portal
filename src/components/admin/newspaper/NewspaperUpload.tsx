import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface NewspaperUploadProps {
  onUploadSuccess: () => void;
}

export const NewspaperUpload = ({ onUploadSuccess }: NewspaperUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState("");

  const uploadPDF = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
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

      setUploading(true);
      setUploadProgress(0);

      // Show initial upload status
      const uploadToast = toast({
        title: "Upload started",
        description: "Uploading PDF file...",
      });

      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      // Upload the file with progress tracking
      const { error: uploadError, data } = await supabase.storage
        .from('newspapers')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(percent);
            
            // Update toast with progress
            uploadToast.update({
              description: `Uploading: ${Math.round(percent)}%`
            });
          }
        });

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

      // Clear form and show success
      setTitle("");
      setUploadProgress(100);
      onUploadSuccess();
      
      uploadToast.dismiss();
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

  return (
    <div className="mb-6 space-y-4">
      <Input
        type="text"
        placeholder="Enter newspaper title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={uploading}
        className="bg-[#333333] border-[#444444] text-white"
      />
      <div className="space-y-2">
        <Input
          type="file"
          onChange={uploadPDF}
          disabled={uploading}
          accept="application/pdf"
          className="bg-[#333333] border-[#444444] text-white file:bg-[#444444] file:text-white file:border-[#555555] hover:file:bg-[#DC2626] file:transition-colors"
        />
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span className="text-sm text-white">Uploading...</span>
            </div>
            <Progress value={uploadProgress} className="h-2 bg-[#444444]" />
          </div>
        )}
      </div>
    </div>
  );
};