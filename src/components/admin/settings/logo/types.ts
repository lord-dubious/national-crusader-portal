import { z } from "zod";

export const logoSettingsSchema = z.object({
  logo_type: z.enum(['text', 'image']),
  logo_text: z.string().optional(),
  logo_text_color: z.string().optional(),
  logo_image_url: z.string().optional(),
  logo_font_family: z.string().optional(),
  logo_font_url: z.string().optional(),
});

export type LogoSettingsFormValues = z.infer<typeof logoSettingsSchema>;