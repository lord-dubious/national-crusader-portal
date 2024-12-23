import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  pdf: {
    name: string;
    id: string;
    created_at: string;
  };
}

export const PDFViewer = ({ pdf }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const pdfUrl = supabase.storage.from('pdf_newspapers').getPublicUrl(pdf.name).data.publicUrl;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => Math.min(Math.max(1, prevPageNumber + offset), numPages));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex flex-col items-center">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-[400px]">
              Loading PDF...
            </div>
          }
          error={
            <div className="flex items-center justify-center h-[400px] text-red-500">
              Error loading PDF!
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            width={300}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
        
        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(pdfUrl, '_blank')}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <h3 className="mt-4 font-medium text-lg">
          {pdf.name.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {new Date(pdf.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};