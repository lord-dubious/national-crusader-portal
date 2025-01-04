import { Document, Page, pdfjs } from 'react-pdf';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ZoomControls } from "./ZoomControls";
import { PageNavigation } from "./PageNavigation";
import { useSwipeable } from "react-swipeable";
import { X } from "lucide-react";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ExpandedViewProps {
  pdfUrl: string;
  pageNumber: number;
  numPages: number;
  scale: number;
  onPageChange: (offset: number) => void;
  onZoom: (delta: number) => void;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onClose: () => void;
}

export const ExpandedView = ({
  pdfUrl,
  pageNumber,
  numPages,
  scale,
  onPageChange,
  onZoom,
  onDocumentLoadSuccess,
  onClose,
}: ExpandedViewProps) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onPageChange(1),
    onSwipedRight: () => onPageChange(-1),
    touchEventOptions: { passive: false },
    trackMouse: true
  });

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      onZoom(delta);
    }
  };

  return (
    <ScrollArea 
      className="h-full w-full relative" 
      onWheel={handleWheel}
    >
      {/* Exit button moved outside the controls div */}
      <button 
        onClick={onClose} 
        className="absolute right-4 top-4 z-50 p-2 bg-black/50 text-white hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close PDF Viewer"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex flex-col items-center justify-start p-4 min-h-full" {...handlers}>
        <div className="flex items-center justify-between w-full mb-4 px-2">
          <ZoomControls scale={scale} onZoom={onZoom} />
          <PageNavigation 
            currentPage={pageNumber} 
            totalPages={numPages} 
            onPageChange={onPageChange} 
          />
        </div>

        <div className="w-full h-full flex items-center justify-center overflow-hidden">
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
              pageNumber={pageNumber} 
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="max-w-full h-auto"
              width={Math.min(window.innerWidth * 0.85, 1000)}
            />
          </Document>
        </div>
      </div>
      <ScrollBar orientation="vertical" className="bg-accent/20 opacity-0 transition-opacity hover:opacity-100" />
    </ScrollArea>
  );
};
