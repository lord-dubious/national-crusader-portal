import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (offset: number) => void;
  size?: "small" | "default";
}

export const PageNavigation = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  size = "default"
}: PageNavigationProps) => {
  const buttonSize = size === "small" ? "h-6 w-6" : "h-8 w-8";
  const iconSize = size === "small" ? "h-3 w-3" : "h-4 w-4";
  const textSize = size === "small" ? "text-xs" : "text-sm";
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(-1)}
        disabled={currentPage <= 1}
        className={`${buttonSize} bg-black border-accent hover:bg-accent/10 hover:text-accent text-white/80`}
      >
        <ChevronLeft className={iconSize} />
      </Button>
      
      <span className={`${textSize} text-white/80`}>
        {currentPage} / {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={currentPage >= totalPages}
        className={`${buttonSize} bg-black border-accent hover:bg-accent/10 hover:text-accent text-white/80`}
      >
        <ChevronRight className={iconSize} />
      </Button>
    </div>
  );
};