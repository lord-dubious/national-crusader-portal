import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PDFViewerProps {
  pdf: {
    name: string;
    id: string;
    created_at: string;
  };
  index: number;
}

export const PDFViewer = ({ pdf, index }: PDFViewerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (window.jQuery) {
      const pdfUrl = `${supabase.storage.from('pdf_newspapers').getPublicUrl(pdf.name).data.publicUrl}`;
      console.log(`Initializing flip-book for PDF ${index}:`, pdfUrl);
      
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
    }
  }, [pdf, index, toast]);

  return (
    <div className="flex-none w-[300px]">
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
  );
};