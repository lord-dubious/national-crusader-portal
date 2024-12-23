import { Document, Page } from 'react-pdf';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ZoomControls } from "./ZoomControls";
import { PageNavigation } from "./PageNavigation";
import { useSwipeable } from "react-swipeable";

interface ExpandedViewProps {
  pdfUrl: string;
  pageNumber: number;
  numPages: number;
  scale: number;
  onPageChange: (offset: number) => void;
  onZoom: (delta: number) => void;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

export const ExpandedView = ({
  pdfUrl,
  pageNumber,
  numPages,
  scale,
  onPageChange,
  onZoom,
  onDocumentLoadSuccess,
}: ExpandedViewProps) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onPageChange(1),
    onSwipedRight: () => onPageChange(-1),
    preventDefaultTouchmoveEvent: true,
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
      className="h-full w-full" 
      onWheel={handleWheel}
    >
      <div className="flex flex-col items-center justify-start p-6 min-h-full" {...handlers}>
        <div className="flex items-center justify-between w-full mb-4">
          <ZoomControls scale={scale} onZoom={onZoom} />
          <PageNavigation 
            currentPage={pageNumber} 
            totalPages={numPages} 
            onPageChange={onPageChange} 
          />
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
            pageNumber={pageNumber} 
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="max-w-full"
          />
        </Document>
      </div>
      <ScrollBar orientation="vertical" className="bg-accent/20 opacity-0 transition-opacity hover:opacity-100" />
    </ScrollArea>
  );
};