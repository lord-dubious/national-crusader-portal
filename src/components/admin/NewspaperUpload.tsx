import { MediaLibrary } from "./MediaLibrary";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NewspaperUpload = () => {
  const { toast } = useToast();

  const handlePdfSelect = async (url: string) => {
    try {
      const { error } = await supabase
        .from('newspapers')
        .insert([
          {
            title: url.split('/').pop()?.split('.')[0] || 'Untitled Newspaper',
            pdf_url: url,
            status: 'published'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Newspaper PDF uploaded and saved successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save newspaper information"
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Upload Newspaper PDF</h2>
      <MediaLibrary 
        type="pdf"
        bucketName="pdf_newspapers"
        onSelect={handlePdfSelect}
      />
    </div>
  );
};