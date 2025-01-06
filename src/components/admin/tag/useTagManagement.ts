import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tag, TagFormValues } from "./types";

export const useTagManagement = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tags, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Tag[];
    },
  });

  const createTag = useMutation({
    mutationFn: async (values: TagFormValues) => {
      const slug = values.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const { data, error } = await supabase
        .from("tags")
        .insert([{ name: values.name, slug }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast({
        title: "Success",
        description: "Tag created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      });
      console.error("Error creating tag:", error);
    },
  });

  const updateTag = useMutation({
    mutationFn: async (values: TagFormValues & { id: number }) => {
      const slug = values.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const { data, error } = await supabase
        .from("tags")
        .update({ name: values.name, slug })
        .eq("id", values.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setIsEditing(false);
      setSelectedTag(null);
      toast({
        title: "Success",
        description: "Tag updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update tag",
        variant: "destructive",
      });
      console.error("Error updating tag:", error);
    },
  });

  const deleteTag = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive",
      });
      console.error("Error deleting tag:", error);
    },
  });

  return {
    tags,
    isLoading,
    isEditing,
    selectedTag,
    setIsEditing,
    setSelectedTag,
    createTag,
    updateTag,
    deleteTag,
  };
};