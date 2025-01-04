import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { supabase } from "@/integrations/supabase/client";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PageNavigation } from "./PageNavigation";
import { ExpandedView } from "./ExpandedView";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Script from '@/components/Script';

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
  const [expandedPageNumber, setExpandedPageNumber] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const flipbookRef = useRef<HTMLDivElement>(null);
  const pdfUrl = supabase.storage.from('pdf_newspapers').getPublicUrl(pdf.name).data.publicUrl;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    // Initialize turn.js after the document is loaded
    if (flipbookRef.current && typeof window !== 'undefined') {
      const $ = (window as any).$;
      if ($) {
        $(flipbookRef.current).turn({
          width: 280,
          height: 400,
          autoCenter: true,
          acceleration: true,
          gradients: true,
          elevation: 50,
          when: {
            turning: function(event: any, page: number) {
              setPageNumber(page);
            }
          }
        });
      }
    }

    return () => {
      const $ = (window as any).$;
      if ($ && flipbookRef.current) {
        $(flipbookRef.current).turn('destroy');
      }
    };
  }, [numPages]);

  const changePage = (offset: number, isExpanded: boolean = false) => {
    if (isExpanded) {
      setExpandedPageNumber(prevPageNumber => 
        Math.min(Math.max(1, prevPageNumber + offset), numPages)
      );
    } else {
      const $ = (window as any).$;
      if ($ && flipbookRef.current) {
        if (offset > 0) {
          $(flipbookRef.current).turn('next');
        } else {
          $(flipbookRef.current).turn('previous');
        }
      }
    }
  };

  return (
    <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-4 border border-accent/20 hover:border-accent/40 transition-colors">
      <div className="flex flex-col items-center">
        <div 
          className="relative group cursor-pointer" 
          onClick={() => setIsOpen(true)}
        >
          <div ref={flipbookRef} className="flipbook">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center h-[400px] text-white/80">
                  Loading PDF...
                </div>
              }
              error={
                <div className="flex items-center justify-center h-[400px] text-accent">
                  Error loading PDF!
                </div>
              }
            >
              <Page 
                pageNumber={pageNumber} 
                width={280}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
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

      <Script src="https://code.jquery.com/jquery-3.7.1.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/turn.js@1.0.5/turn.min.js" />
    </div>
  );
};