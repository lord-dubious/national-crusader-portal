import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Must be a valid URL"),
  icon: z.string().min(1, "Icon is required"),
});

type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

type SocialLink = {
  id: number;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export const SiteSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: "",
      url: "",
      icon: "",
    },
  });

  const { data: socialLinks, isLoading } = useQuery({
    queryKey: ["social-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("platform");
      
      if (error) throw error;
      return data as SocialLink[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: SocialLinkFormValues) => {
      const { data, error } = await supabase
        .from("social_links")
        .insert([{
          platform: values.platform,
          url: values.url,
          icon: values.icon,
          is_active: true,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      toast({ title: "Social link added successfully" });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error adding social link",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("social_links")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      toast({ title: "Social link deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error deleting social link",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: SocialLinkFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Site Settings</h2>
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Social Links</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Twitter" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., twitter" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit">Add Social Link</Button>
              </form>
            </Form>

            <div className="mt-6">
              <h4 className="font-medium mb-2">Current Social Links</h4>
              <div className="space-y-2">
                {socialLinks?.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div>
                      <span className="font-medium">{link.platform}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {link.url}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this social link?")) {
                          deleteMutation.mutate(link.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
