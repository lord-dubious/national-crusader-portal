import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { LogoSettingsFormValues } from "./types";

interface TextLogoSettingsProps {
  form: UseFormReturn<LogoSettingsFormValues>;
  handleFontUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const TextLogoSettings = ({ form, handleFontUpload }: TextLogoSettingsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="logo_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Logo Text</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                className="bg-[#333333] border-[#444444] text-white"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="logo_text_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Text Color</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="color"
                className="h-10 px-2 bg-[#333333] border-[#444444]"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div>
        <FormLabel className="text-white block mb-2">Custom Font</FormLabel>
        <Input
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          onChange={handleFontUpload}
          className="bg-[#333333] border-[#444444] text-white"
        />
      </div>
    </>
  );
};