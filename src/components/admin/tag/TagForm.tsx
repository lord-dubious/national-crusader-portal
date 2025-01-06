import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Tag } from "./types";

const tagFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type TagFormValues = z.infer<typeof tagFormSchema>;

interface TagFormProps {
  onSubmit: (values: TagFormValues) => void;
  initialValues?: Tag;
  isSubmitting?: boolean;
}

export const TagForm = ({ onSubmit, initialValues, isSubmitting }: TagFormProps) => {
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: initialValues?.name || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-[#2A2F3E] border-gray-600 text-white placeholder:text-gray-400"
                  placeholder="Enter tag name"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <Button type="submit" variant="active" disabled={isSubmitting}>
          {initialValues ? "Update Tag" : "Create Tag"}
        </Button>
      </form>
    </Form>
  );
};