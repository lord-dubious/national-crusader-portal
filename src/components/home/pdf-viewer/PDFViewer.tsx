import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { supabase } from "@/integrations/supabase/client";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PageNavigation } from "./PageNavigation";
import { ExpandedView } from "./ExpandedView";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

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
  const [isLoading, setIsLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);
  const pdfUrl = supabase.storage.from('pdf_newspapers').getPublicUrl(pdf.name).data.publicUrl;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
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

  const handleZoom = (delta: number) => {
    setScale(prevScale => Math.min(Math.max(0.5, prevScale + delta), 3));
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsLoading(true);
  };

  return (
    <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-4 border border-accent/20 hover:border-accent/40 transition-colors">
      <div className="flex flex-col items-center">
        <div 
          className="relative group cursor-pointer" 
          onClick={handleOpen}
        >
          <div className="w-[280px] h-[400px] bg-[#151515] rounded-lg overflow-hidden">
            {previewError ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <img 
                  src="/placeholder.svg" 
                  alt="Newspaper preview" 
                  className="w-24 h-24 mb-4 opacity-50"
                />
                <h4 className="text-white/90 text-sm font-medium mb-2">
                  {pdf.name.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}
                </h4>
                <p className="text-white/50 text-xs">
                  Click to view newspaper
                </p>
              </div>
            ) : (
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={() => setPreviewError(true)}
                loading={
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-white/50">Loading preview...</div>
                  </div>
                }
              >
                <Page
                  pageNumber={1}
                  width={280}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="rounded-lg"
                />
              </Document>
            )}
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center rounded-lg">
            <Maximize2 className="text-white/0 group-hover:text-white/90 transition-all transform scale-75 group-hover:scale-100" />
          </div>
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
          {isOpen && (
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};