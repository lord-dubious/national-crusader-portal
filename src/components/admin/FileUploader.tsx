import { UploadCloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FileUploaderProps {
  accept?: string;
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

export const FileUploader = ({
  accept,
  onUpload,
  isUploading = false,
}: FileUploaderProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <Card className="bg-[#333333] border-[#444444]">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-[#444444] hover:border-[#DC2626] transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and
                drop
              </p>
              {accept && (
                <p className="text-xs text-gray-400">
                  Allowed file types: {accept}
                </p>
              )}
            </div>
          </label>
          {isUploading && (
            <p className="text-sm text-gray-400">Uploading file...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};