import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Newspaper } from "lucide-react";
import { useEffect } from "react";

declare global {
  interface Window {
    jQuery: any;
    $: any;
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

  useEffect(() => {
    const loadScripts = async () => {
      // First, load jQuery
      const jqueryScript = document.createElement("script");
      jqueryScript.src = "https://code.jquery.com/jquery-3.7.1.min.js";
      await new Promise((resolve) => {
        jqueryScript.onload = resolve;
        document.body.appendChild(jqueryScript);
      });

      // Then load the flip-book CSS
      const flipBookCss = document.createElement("link");
      flipBookCss.rel = "stylesheet";
      flipBookCss.href = "https://3dflipbook.net/css/flipbook.style.css";
      document.head.appendChild(flipBookCss);

      // Finally load the flip-book script
      const flipBookScript = document.createElement("script");
      flipBookScript.src = "https://3dflipbook.net/js/flipbook.min.js";
      await new Promise((resolve) => {
        flipBookScript.onload = resolve;
        document.body.appendChild(flipBookScript);
      });

      // Initialize flip-books after all scripts are loaded
      if (pdfs && window.jQuery) {
        console.log("All scripts loaded, initializing flip-books for PDFs:", pdfs);
        pdfs.forEach((pdf, index) => {
          const pdfUrl = `${supabase.storage.from('pdf_newspapers').getPublicUrl(pdf.name).data.publicUrl}`;
          console.log(`Creating flip-book instance for PDF ${index}:`, pdfUrl);
          try {
            window.jQuery(`#flip-book-${index}`).flipBook({
              pdfUrl: pdfUrl,
              lightBox: true,
              layout: 3,
              currentPage: {
                color: "#000000",
                fontSize: 12
              },
              btnShare: {
                enabled: false
              },
              btnPrint: {
                enabled: false
              },
              btnDownloadPages: {
                enabled: false
              },
              btnDownloadPdf: {
                enabled: false
              },
              btnColor: 'rgb(255, 120, 60)',
              sideBtnColor: 'rgb(255, 120, 60)',
              sideBtnSize: 60,
              sideBtnBackground: "rgba(0,0,0,0.7)",
              sideBtnRadius: 60
            });
          } catch (err) {
            console.error(`Error initializing flip-book for PDF ${index}:`, err);
            toast({
              variant: "destructive",
              title: "PDF Viewer Error",
              description: `Could not load PDF ${pdf.name}`
            });
          }
        });
      }
    };

    loadScripts().catch(err => {
      console.error("Error loading scripts:", err);
      toast({
        variant: "destructive",
        title: "Error Loading PDF Viewer",
        description: "Could not initialize the PDF viewer"
      });
    });

    return () => {
      // Cleanup scripts and CSS
      document.querySelectorAll('script').forEach(script => {
        if (script.src.includes('jquery') || script.src.includes('flipbook')) {
          document.body.removeChild(script);
        }
      });
      document.querySelectorAll('link').forEach(link => {
        if (link.href.includes('flipbook')) {
          document.head.removeChild(link);
        }
      });
    };
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
                id={`flip-book-${index}`}
                className="flip-book"
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