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
      // Load jQuery first
      const jqueryScript = document.createElement("script");
      jqueryScript.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.js";
      document.body.appendChild(jqueryScript);

      await new Promise((resolve) => {
        jqueryScript.onload = resolve;
      });

      // Load jQuery UI
      const jqueryUIScript = document.createElement("script");
      jqueryUIScript.src = "https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js";
      document.body.appendChild(jqueryUIScript);

      await new Promise((resolve) => {
        jqueryUIScript.onload = resolve;
      });

      // Load Three.js
      const threeScript = document.createElement("script");
      threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      document.body.appendChild(threeScript);

      await new Promise((resolve) => {
        threeScript.onload = resolve;
      });

      // Load PDF.js
      const pdfScript = document.createElement("script");
      pdfScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js";
      document.body.appendChild(pdfScript);

      await new Promise((resolve) => {
        pdfScript.onload = resolve;
      });

      // Load 3D FlipBook
      const flipBookScript = document.createElement("script");
      flipBookScript.src = "https://raw.githack.com/Showkiip/3d-flipbook-jquery/main/3d-flip-book/js/html2canvas.min.js";
      document.body.appendChild(flipBookScript);

      await new Promise((resolve) => {
        flipBookScript.onload = resolve;
      });

      // Load the main flip book script
      const mainFlipBookScript = document.createElement("script");
      mainFlipBookScript.src = "https://raw.githack.com/Showkiip/3d-flipbook-jquery/main/3d-flip-book/js/3d-flip-book.min.js";
      document.body.appendChild(mainFlipBookScript);

      await new Promise((resolve) => {
        mainFlipBookScript.onload = resolve;
      });

      // Initialize flip-books after all scripts are loaded
      if (pdfs && window.jQuery) {
        console.log("All scripts loaded, initializing flip-books for PDFs:", pdfs);
        pdfs.forEach((pdf, index) => {
          const pdfUrl = `${supabase.storage.from('pdf_newspapers').getPublicUrl(pdf.name).data.publicUrl}`;
          console.log(`Creating flip-book instance for PDF ${index}:`, pdfUrl);
          try {
            window.jQuery(`#flip-book-${index}`).FlipBook({
              pdf: pdfUrl,
              template: {
                html: "https://raw.githack.com/Showkiip/3d-flipbook-jquery/main/3d-flip-book/templates/default-book-view.html",
                styles: [
                  "https://raw.githack.com/Showkiip/3d-flipbook-jquery/main/3d-flip-book/css/font-awesome.min.css",
                  "https://raw.githack.com/Showkiip/3d-flipbook-jquery/main/3d-flip-book/css/short-black-book-view.css"
                ],
                links: [
                  {
                    rel: "stylesheet",
                    href: "https://raw.githack.com/Showkiip/3d-flipbook-jquery/main/3d-flip-book/css/font-awesome.min.css"
                  },
                  {
                    rel: "stylesheet",
                    href: "https://raw.githack.com/Showkiip/3d-flipbook-jquery/main/3d-flip-book/css/short-black-book-view.css"
                  }
                ]
              }
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
      // Cleanup scripts
      document.querySelectorAll('script').forEach(script => {
        if (
          script.src.includes('jquery') ||
          script.src.includes('three') ||
          script.src.includes('pdf') ||
          script.src.includes('flip-book')
        ) {
          document.body.removeChild(script);
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