import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { LogoSettingsFormValues } from "./types";

interface LogoTypeSelectorProps {
  form: UseFormReturn<LogoSettingsFormValues>;
}

export const LogoTypeSelector = ({ form }: LogoTypeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="logo_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Logo Type</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <label htmlFor="text" className="text-white">Text</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <label htmlFor="image" className="text-white">Image</label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};