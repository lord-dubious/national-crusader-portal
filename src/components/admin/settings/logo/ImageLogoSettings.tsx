import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { LogoSettingsFormValues } from "./types";

interface ImageLogoSettingsProps {
  form: UseFormReturn<LogoSettingsFormValues>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const ImageLogoSettings = ({ form, handleImageUpload }: ImageLogoSettingsProps) => {
  const logoImageUrl = form.watch('logo_image_url');

  return (
    <div className="space-y-4">
      <div>
        <FormLabel className="text-white block mb-2">Logo Image</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="bg-[#333333] border-[#444444] text-white"
        />
      </div>
      
      {logoImageUrl && (
        <div className="mt-4">
          <FormLabel className="text-white block mb-2">Preview</FormLabel>
          <div className="relative w-48 h-24 bg-[#333333] rounded-lg overflow-hidden">
            <img
              src={logoImageUrl}
              alt="Logo preview"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};