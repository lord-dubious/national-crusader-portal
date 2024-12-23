import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Newspaper } from "lucide-react";
import { PDFViewer } from "./pdf-viewer/PDFViewer";

export const NewspaperSection = () => {
  const { toast } = useToast();
  
  const { 
    data: pdfs, 
    error: pdfError, 
    isLoading: isLoadingPDFs 
  } = useQuery({
    queryKey: ["storage-pdfs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .storage
        .from('pdf_newspapers')
        .list();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching PDFs",
          description: error.message
        });
        console.error("PDFs fetch error:", error);
        throw error;
      }
      
      const pdfFiles = data?.filter(file => file.name.toLowerCase().endsWith('.pdf')) || [];
      console.log("Fetched PDFs:", pdfFiles);
      return pdfFiles;
    },
  });

  if (isLoadingPDFs) {
    return (
      <section className="py-12 bg-muted animate-fade-up">
        <div className="container mx-auto text-center">
          Loading PDFs...
        </div>
      </section>
    );
  }

  if (pdfError || !pdfs?.length) {
    console.log("No PDFs found or error occurred", { pdfError, pdfs });
    return null;
  }

  return (
    <section className="py-12 bg-muted animate-fade-up">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Newspaper className="h-6 w-6 text-accent mr-2" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Latest Newspapers</h2>
          <div className="h-1 bg-accent flex-grow ml-4 rounded hidden sm:block" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pdfs.map((pdf) => (
            <PDFViewer key={pdf.id} pdf={pdf} />
          ))}
        </div>
      </div>
    </section>
  );
};