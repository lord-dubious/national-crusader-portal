import { useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useScriptLoader } from './useScriptLoader';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface FlipbookProps {
  pdfUrl: string;
  pageNumber: number;
  numPages: number;
  onPageChange: (page: number) => void;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

export const Flipbook = ({ 
  pdfUrl, 
  pageNumber, 
  numPages, 
  onPageChange,
  onDocumentLoadSuccess 
}: FlipbookProps) => {
  const flipbookRef = useRef<HTMLDivElement>(null);
  const { scriptsLoaded } = useScriptLoader();

  // Initialize turn.js after scripts and document are loaded
  useEffect(() => {
    if (scriptsLoaded && flipbookRef.current && numPages > 0) {
      const $ = (window as any).$;
      if ($) {
        try {
          $(flipbookRef.current).turn({
            width: 280,
            height: 400,
            autoCenter: true,
            acceleration: true,
            gradients: true,
            elevation: 50,
            when: {
              turning: function(_event: any, page: number) {
                onPageChange(page);
              }
            }
          });
        } catch (error) {
          console.error('Error initializing turn.js:', error);
        }
      }
    }

    return () => {
      if (scriptsLoaded) {
        const $ = (window as any).$;
        if ($ && flipbookRef.current) {
          try {
            $(flipbookRef.current).turn('destroy');
          } catch (error) {
            console.error('Error destroying turn.js instance:', error);
          }
        }
      }
    };
  }, [scriptsLoaded, numPages, onPageChange]);

  // Handle manual page changes
  useEffect(() => {
    if (scriptsLoaded && flipbookRef.current) {
      const $ = (window as any).$;
      if ($) {
        try {
          $(flipbookRef.current).turn('page', pageNumber);
        } catch (error) {
          console.error('Error changing page:', error);
        }
      }
    }
  }, [pageNumber, scriptsLoaded]);

  return (
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
  );
};
