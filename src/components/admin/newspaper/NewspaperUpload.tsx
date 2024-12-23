import { useNewspaperUpload } from "./hooks/useNewspaperUpload";
import { NewspaperForm } from "./components/NewspaperForm";
import { UploadProgress } from "./components/UploadProgress";
import { useToast } from "@/hooks/use-toast";

interface NewspaperUploadProps {
  onUploadSuccess: () => void;
}

export const NewspaperUpload = ({ onUploadSuccess }: NewspaperUploadProps) => {
  const { toast } = useToast();
  const { uploading, uploadProgress, uploadNewspaper } = useNewspaperUpload(onUploadSuccess);

  const handleSubmit = (title: string, file: File) => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Title required",
        description: "Please enter a title for the newspaper."
      });
      return;
    }
    uploadNewspaper(title, file);
  };

  return (
    <div className="mb-6 space-y-4">
      <NewspaperForm onSubmit={handleSubmit} isUploading={uploading} />
      {uploading && <UploadProgress progress={uploadProgress} />}
    </div>
  );
};