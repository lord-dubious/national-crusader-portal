import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const logoSettingsSchema = z.object({
  logo_type: z.enum(['text', 'image']),
  logo_text: z.string().optional(),
  logo_text_color: z.string().optional(),
  logo_image_url: z.string().optional(),
  logo_font_family: z.string().optional(),
  logo_font_url: z.string().optional(),
});

type LogoSettingsFormValues = z.infer<typeof logoSettingsSchema>;

export const LogoSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LogoSettingsFormValues>({
    resolver: zodResolver(logoSettingsSchema),
    defaultValues: {
      logo_type: 'text',
      logo_text: '',
      logo_text_color: '#000000',
      logo_image_url: '',
      logo_font_family: '',
      logo_font_url: '',
    },
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: LogoSettingsFormValues) => {
      const { data, error } = await supabase
        .from("site_settings")
        .update(values)
        .eq('id', settings?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({ title: "Logo settings updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error updating logo settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFontUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      form.setValue('logo_font_url', publicUrl);
      form.setValue('logo_font_family', file.name.split('.')[0]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error uploading font",
        description: error.message
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      form.setValue('logo_image_url', publicUrl);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error uploading image",
        description: error.message
      });
    }
  };

  const onSubmit = (values: LogoSettingsFormValues) => {
    updateMutation.mutate(values);
  };

  return (
    <div className="bg-[#222222] p-6 rounded-lg border border-[#333333]">
      <h3 className="text-lg font-semibold mb-4 text-white">Logo Settings</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          {form.watch('logo_type') === 'text' && (
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
          )}

          {form.watch('logo_type') === 'image' && (
            <div>
              <FormLabel className="text-white block mb-2">Logo Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-[#333333] border-[#444444] text-white"
              />
            </div>
          )}

          <Button 
            type="submit"
            className="bg-[#DC2626] text-white hover:bg-[#DC2626]/90 transition-colors"
          >
            Save Logo Settings
          </Button>
        </form>
      </Form>
    </div>
  );
};