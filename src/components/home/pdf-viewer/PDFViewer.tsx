import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PageNavigation } from "./PageNavigation";
import { ExpandedView } from "./ExpandedView";
import { Flipbook } from "./Flipbook";
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  const [expandedPageNumber, setExpandedPageNumber] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  
  const pdfUrl = supabase.storage.from('pdf_newspapers').getPublicUrl(pdf.name).data.publicUrl;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleZoom = (delta: number) => {
    setScale(prevScale => Math.min(Math.max(0.5, prevScale + delta), 2.5));
  };

  const changePage = (offset: number, isExpanded: boolean = false) => {
    if (isExpanded) {
      setExpandedPageNumber(prevPageNumber => 
        Math.min(Math.max(1, prevPageNumber + offset), numPages)
      );
    } else {
      setPageNumber(prevPageNumber => 
        Math.min(Math.max(1, prevPageNumber + offset), numPages)
      );
    }
  };

  return (
    <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-4 border border-accent/20 hover:border-accent/40 transition-colors">
      <div className="flex flex-col items-center">
        <div 
          className="relative group cursor-pointer" 
          onClick={() => setIsOpen(true)}
        >
          <Flipbook
            pdfUrl={pdfUrl}
            pageNumber={pageNumber}
            numPages={numPages}
            onPageChange={setPageNumber}
            onDocumentLoadSuccess={onDocumentLoadSuccess}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <Maximize2 className="text-white/0 group-hover:text-white/90 transition-all transform scale-75 group-hover:scale-100" />
          </div>
        </div>
        
        <div className="mt-3">
          <PageNavigation
            currentPage={pageNumber}
            totalPages={numPages}
            onPageChange={(offset) => changePage(offset)}
            size="small"
          />
        </div>

        <h3 className="mt-3 font-medium text-xs text-white/90 text-center">
          {pdf.name.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}
        </h3>
        <p className="text-[10px] text-white/60">
          {new Date(pdf.created_at).toLocaleDateString()}
        </p>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] h-[95vh] p-0 bg-[#0A0A0A] border-accent/20">
          <ExpandedView
            pdfUrl={pdfUrl}
            pageNumber={expandedPageNumber}
            numPages={numPages}
            scale={scale}
            onPageChange={(offset) => changePage(offset, true)}
            onZoom={handleZoom}
            onDocumentLoadSuccess={onDocumentLoadSuccess}
            onClose={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};