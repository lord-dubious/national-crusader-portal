import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  progress: number;
}

export const UploadProgress = ({ progress }: UploadProgressProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-white" />
        <span className="text-sm text-white">Uploading...</span>
      </div>
      <Progress value={progress} className="h-2 bg-[#444444]" />
    </div>
  );
};