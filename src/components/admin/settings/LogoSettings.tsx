import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogoTypeSelector } from "./logo/LogoTypeSelector";
import { TextLogoSettings } from "./logo/TextLogoSettings";
import { ImageLogoSettings } from "./logo/ImageLogoSettings";
import { logoSettingsSchema, type LogoSettingsFormValues } from "./logo/types";
import { useEffect } from "react";

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

  useEffect(() => {
    if (settings) {
      // Validate logo_type before setting it
      const logo_type = settings.logo_type === 'image' ? 'image' : 'text';
      
      form.reset({
        logo_type,
        logo_text: settings.logo_text || '',
        logo_text_color: settings.logo_text_color || '#000000',
        logo_image_url: settings.logo_image_url || '',
        logo_font_family: settings.logo_font_family || '',
        logo_font_url: settings.logo_font_url || '',
      });
    }
  }, [settings, form]);

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

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="bg-[#222222] p-6 rounded-lg border border-[#333333]">
      <h3 className="text-lg font-semibold mb-4 text-white">Logo Settings</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <LogoTypeSelector form={form} />

          {form.watch('logo_type') === 'text' && (
            <TextLogoSettings form={form} handleFontUpload={handleFontUpload} />
          )}

          {form.watch('logo_type') === 'image' && (
            <ImageLogoSettings form={form} handleImageUpload={handleImageUpload} />
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