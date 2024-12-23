import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Newspaper } from "lucide-react";
import { PDFViewer } from "./pdf-viewer/PDFViewer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
      <section className="py-12 bg-[#111111] animate-fade-up">
        <div className="container mx-auto text-center text-white">
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
    <section className="py-12 bg-[#111111] animate-fade-up">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Newspaper className="h-6 w-6 text-accent mr-2" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Latest Newspapers</h2>
          <div className="h-1 bg-accent flex-grow ml-4 rounded hidden sm:block" />
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-6 pb-4">
            {pdfs.map((pdf) => (
              <div key={pdf.id} className="w-[300px] flex-none">
                <PDFViewer pdf={pdf} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="bg-accent/20" />
        </ScrollArea>
      </div>
    </section>
  );
};