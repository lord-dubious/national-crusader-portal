import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

interface ZoomControlsProps {
  scale: number;
  onZoom: (delta: number) => void;
}

export const ZoomControls = ({ scale, onZoom }: ZoomControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onZoom(-0.1)}
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
        onClick={() => onZoom(0.1)}
        className="h-8 w-8 bg-black border-accent hover:bg-accent/10 hover:text-accent text-white/80"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
};