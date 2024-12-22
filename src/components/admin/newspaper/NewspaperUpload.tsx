import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface NewspaperUploadProps {
  onUploadSuccess: () => void;
}

export const NewspaperUpload = ({ onUploadSuccess }: NewspaperUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");

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

      onUploadSuccess();
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

  return (
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
  );
};