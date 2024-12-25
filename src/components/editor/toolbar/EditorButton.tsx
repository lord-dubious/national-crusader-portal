import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EditorButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: LucideIcon;
}

export const EditorButton = ({ onClick, isActive, icon: Icon }: EditorButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    className={`text-white hover:bg-[#3A3F4E] ${isActive ? 'bg-[#DC2626] hover:bg-[#DC2626]/90' : ''}`}
  >
    <Icon className="h-4 w-4" />
  </Button>
);