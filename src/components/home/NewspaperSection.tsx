import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Newspaper } from "lucide-react";
import { useEffect } from "react";

declare global {
  interface Window {
    DFlip: any;
  }
}

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: any;
}

export const NewspaperSection = () => {
  const { toast } = useToast();
  const { 
    data: pdfs, 
    error, 
    isLoading 
  } = useQuery({
    queryKey: ["storage-pdfs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .storage
        .from('newspapers')
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
      
      // Filter for PDF files only
      const pdfFiles = data?.filter(file => file.name.toLowerCase().endsWith('.pdf')) || [];
      console.log("Fetched PDFs:", pdfFiles);
      return pdfFiles;
    },
  });

  useEffect(() => {
    // Load DearFlip script
    const script = document.createElement("script");
    script.src = "https://cdn.dearflip.com/dearflip.js";
    script.async = true;
    document.body.appendChild(script);

    // Load DearFlip CSS
    const link = document.createElement("link");
    link.href = "https://cdn.dearflip.com/dearflip.css";
    link.rel = "stylesheet";
    link.type = "text/css";
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (pdfs && window.DFlip) {
      console.log("Initializing DFlip for PDFs:", pdfs);
      pdfs.forEach((pdf, index) => {
        const pdfUrl = `${supabase.storage.from('newspapers').getPublicUrl(pdf.name).data.publicUrl}`;
        console.log(`Creating DFlip instance for PDF ${index}:`, pdfUrl);
        try {
          new window.DFlip(`#df-newspaper-${index}`, {
            webgl: true,
            height: 400,
            duration: 800,
            direction: 1,
            backgroundColor: "rgb(241, 241, 241)",
            soundEnable: true,
            autoEnableOutline: true,
            enableDownload: false,
            source: pdfUrl,
            autoPlay: false,
            autoPlayStart: false,
          });
        } catch (err) {
          console.error(`Error initializing DFlip for PDF ${index}:`, err);
          toast({
            variant: "destructive",
            title: "PDF Viewer Error",
            description: `Could not load PDF ${pdf.name}`
          });
        }
      });
    }
  }, [pdfs, toast]);

  if (isLoading) {
    return (
      <section className="py-12 bg-muted animate-fade-up">
        <div className="container mx-auto text-center">
          Loading PDFs...
        </div>
      </section>
    );
  }

  if (error || !pdfs?.length) {
    console.log("No PDFs found or error occurred", { error, pdfs });
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
            <div 
              key={pdf.id}
              className="flex-none w-[300px]"
            >
              <div 
                id={`df-newspaper-${index}`}
                className="dearflip-volume"
                style={{ width: "100%", height: "400px" }}
              />
              <h3 className="mt-4 font-medium text-lg">
                {pdf.name.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {new Date(pdf.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};