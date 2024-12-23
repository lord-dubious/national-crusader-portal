import { useState } from "react";
import { Input } from "@/components/ui/input";

interface NewspaperFormProps {
  onSubmit: (title: string, file: File) => void;
  isUploading: boolean;
}

export const NewspaperForm = ({ onSubmit, isUploading }: NewspaperFormProps) => {
  const [title, setTitle] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && title.trim()) {
      onSubmit(title, file);
      setTitle("");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Enter newspaper title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isUploading}
        className="bg-[#333333] border-[#444444] text-white"
      />
      <Input
        type="file"
        onChange={handleFileChange}
        disabled={isUploading}
        accept="application/pdf"
        className="bg-[#333333] border-[#444444] text-white file:bg-[#444444] file:text-white file:border-[#555555] hover:file:bg-[#DC2626] file:transition-colors"
      />
    </div>
  );
};