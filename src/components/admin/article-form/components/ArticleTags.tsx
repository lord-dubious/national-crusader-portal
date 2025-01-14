import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArticleFormValues } from "../types";

export const ArticleTags = () => {
  const [newTag, setNewTag] = useState("");
  const form = useFormContext<ArticleFormValues>();
  const { toast } = useToast();
  const selectedTags = form.watch("tags") || [];

  const { data: existingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const createUniqueSlug = (name: string, existingTags: any[]) => {
    let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    let slug = baseSlug;
    let counter = 1;
    
    while (existingTags?.some(tag => tag.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    try {
      let tagToAdd = existingTags?.find(
        (tag) => tag.name.toLowerCase() === newTag.toLowerCase()
      );

      if (!tagToAdd) {
        const uniqueSlug = createUniqueSlug(newTag, existingTags || []);
        console.log("Creating new tag with slug:", uniqueSlug);
        
        const { data, error } = await supabase
          .from("tags")
          .insert([{ 
            name: newTag, 
            slug: uniqueSlug,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) {
          console.error("Error creating tag:", error);
          toast({
            title: "Error",
            description: "Failed to create tag",
            variant: "destructive",
          });
          return;
        }
        tagToAdd = data;
      }

      const updatedTags = [...selectedTags, tagToAdd.id];
      form.setValue("tags", updatedTags);
      setNewTag("");
      
      toast({
        title: "Success",
        description: "Tag added successfully",
      });
    } catch (error) {
      console.error("Error adding tag:", error);
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive",
      });
    }
  };

  const removeTag = (tagId: number) => {
    const updatedTags = selectedTags.filter((id) => id !== tagId);
    form.setValue("tags", updatedTags);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="tags"
        render={() => (
          <FormItem>
            <FormLabel className="text-white">Tags</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="bg-[#2A2F3E] border-gray-600 text-white placeholder:text-gray-400"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddTag}
                    variant="secondary"
                    className="hover:bg-accent hover:text-accent-foreground"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tagId) => {
                    const tag = existingTags?.find((t) => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <Badge 
                        key={tag.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag.name}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag.id)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
    </div>
  );
};