import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Newspaper } from "lucide-react";
import { useScriptLoader } from "./pdf-viewer/useScriptLoader";
import { PDFViewer } from "./pdf-viewer/PDFViewer";

declare global {
  interface Window {
    jQuery: any;
    $: any;
  }
}

export const NewspaperSection = () => {
  const { toast } = useToast();
  const { isLoading: isLoadingScripts, error: scriptError } = useScriptLoader();
  
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

  if (isLoadingScripts || isLoadingPDFs) {
    return (
      <section className="py-12 bg-muted animate-fade-up">
        <div className="container mx-auto text-center">
          Loading PDFs...
        </div>
      </section>
    );
  }

  if (scriptError || pdfError || !pdfs?.length) {
    console.log("No PDFs found or error occurred", { scriptError, pdfError, pdfs });
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
        <div className="flex overflow-x-auto gap-8 pb-4 -mx-4 px-4">
          {pdfs.map((pdf, index) => (
            <PDFViewer key={pdf.id} pdf={pdf} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};