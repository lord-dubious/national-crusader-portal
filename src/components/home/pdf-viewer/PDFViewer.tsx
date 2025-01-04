import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";
import { ExpandedView } from "./ExpandedView";
import { supabase } from "@/integrations/supabase/client";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdf: {
    name: string;
  };
}

export const PDFViewer = ({ pdf }: PDFViewerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const pdfUrl = supabase.storage
    .from('pdf_newspapers')
    .getPublicUrl(pdf.name).data.publicUrl;

  if (error) {
    console.error("PDF loading error:", error);
    return null;
  }

  return (
    <div className="relative group">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <Document
          file={pdfUrl}
          error={error ? "Failed to load PDF" : undefined}
          onLoadError={setError}
          loading={
            <div className="w-full aspect-[3/4] bg-muted animate-pulse rounded-lg" />
          }
        >
          <Page
            pageNumber={1}
            width={300}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            loading={
              <div className="w-full aspect-[3/4] bg-muted animate-pulse rounded-lg" />
            }
          />
        </Document>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button 
            variant="outline" 
            size="icon"
            className="bg-white/10 hover:bg-white/20"
            onClick={() => setIsExpanded(true)}
          >
            <Expand className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isExpanded && (
        <ExpandedView
          pdfUrl={pdfUrl}
          onClose={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};