import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/admin/FileUploader";
import { PDFViewer } from "@/components/home/pdf-viewer/PDFViewer";

export const NewspaperUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [newspapers, setNewspapers] = useState<any[]>([]);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);

      // Sanitize filename
      const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, "");
      const fileExt = sanitizedFileName.split(".").pop()?.toLowerCase();

      if (fileExt !== "pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }

      // Upload PDF to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("pdf_newspapers")
        .upload(sanitizedFileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Generate thumbnail
      const { data: thumbnailData, error: thumbnailError } = await supabase.functions
        .invoke('generate-pdf-thumbnail', {
          body: { pdfPath: sanitizedFileName }
        });

      if (thumbnailError) {
        console.error('Error generating thumbnail:', thumbnailError);
      }

      // Save newspaper record
      const { data: newspaper, error: dbError } = await supabase
        .from("newspapers")
        .insert([
          {
            title: sanitizedFileName.replace(/\.[^/.]+$/, "").replace(/-/g, " "),
            pdf_url: sanitizedFileName,
            status: "published",
          },
        ])
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Success",
        description: "Newspaper uploaded successfully",
      });

      // Refresh newspapers list
      const { data: updatedNewspapers } = await supabase
        .from("newspapers")
        .select("*")
        .order("created_at", { ascending: false });

      setNewspapers(updatedNewspapers || []);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload newspaper",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Upload Newspaper</h2>
      </div>

      <FileUploader
        accept=".pdf"
        onUpload={handleUpload}
        isUploading={isUploading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newspapers.map((newspaper) => (
          <PDFViewer key={newspaper.id} pdf={newspaper} />
        ))}
      </div>
    </div>
  );
};