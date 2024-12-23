import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
  const pdfUrl = supabase.storage.from('pdf_newspapers').getPublicUrl(pdf.name).data.publicUrl;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
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

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(delta);
    }
  };

  return (
    <div className="bg-[#0A0A0A] rounded-lg shadow-lg p-4 border border-accent/20 hover:border-accent/40 transition-colors">
      <div className="flex flex-col items-center">
        <div 
          className="relative group cursor-pointer" 
          onClick={() => setIsOpen(true)}
        >
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
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <Maximize2 className="text-white/0 group-hover:text-white/90 transition-all transform scale-75 group-hover:scale-100" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              changePage(-1);
            }}
            disabled={pageNumber <= 1}
            className="h-6 w-6 bg-black border-accent hover:bg-accent/10 hover:text-accent text-white/80"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          
          <span className="text-xs text-white/80">
            {pageNumber} / {numPages}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              changePage(1);
            }}
            disabled={pageNumber >= numPages}
            className="h-6 w-6 bg-black border-accent hover:bg-accent/10 hover:text-accent text-white/80"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
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
          <ScrollArea 
            className="h-full w-full" 
            onWheel={handleWheel}
          >
            <div className="flex flex-col items-center justify-start p-6 min-h-full">
              <div className="flex items-center justify-between w-full mb-4">
                <h2 className="text-lg font-semibold text-white/90">
                  {pdf.name.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleZoom(-0.1)}
                    className="h-8 w-8 bg-black border-accent hover:bg-accent/10 hover:text-accent text-white/80"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-white/80 min-w-[60px] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleZoom(0.1)}
                    className="h-8 w-8 bg-black border-accent hover:bg-accent/10 hover:text-accent text-white/80"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex items-center justify-center h-full text-white/80">
                    Loading PDF...
                  </div>
                }
              >
                <Page 
                  pageNumber={expandedPageNumber} 
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="max-w-full"
                />
              </Document>

              <div className="flex items-center justify-center gap-4 mt-4 mb-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => changePage(-1, true)}
                  disabled={expandedPageNumber <= 1}
                  className="h-8 w-8 bg-black border-accent hover:bg-accent/10 hover:text-accent text-white/80"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <span className="text-sm text-white/80">
                  Page {expandedPageNumber} of {numPages}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => changePage(1, true)}
                  disabled={expandedPageNumber >= numPages}
                  className="h-8 w-8 bg-black border-accent hover:bg-accent/10 hover:text-accent text-white/80"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ScrollBar orientation="vertical" className="bg-accent/20 opacity-0 transition-opacity hover:opacity-100" />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};