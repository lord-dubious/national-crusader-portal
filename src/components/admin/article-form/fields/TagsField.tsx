import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormValues } from "../types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tag, X } from "lucide-react";

interface TagsFieldProps {
  form: UseFormReturn<ArticleFormValues>;
}

const PREDEFINED_TAGS = [
  { id: 1, name: "Breaking News" },
  { id: 2, name: "Politics" },
  { id: 3, name: "Technology" },
  { id: 4, name: "Business" },
  { id: 5, name: "Health" },
  { id: 6, name: "Science" },
  { id: 7, name: "Sports" },
  { id: 8, name: "Entertainment" },
  { id: 9, name: "World News" },
  { id: 10, name: "Opinion" },
];

export const TagsField = ({ form }: TagsFieldProps) => {
  const { toast } = useToast();
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching tags",
          description: error.message
        });
        throw error;
      }
      return data;
    },
  });

  const selectedTags = form.watch("tag_ids") || [];

  const handleTagSelect = (tagId: string) => {
    const currentTags = form.getValues("tag_ids") || [];
    const tagIdNum = parseInt(tagId);
    
    if (!currentTags.includes(tagIdNum)) {
      form.setValue("tag_ids", [...currentTags, tagIdNum]);
    }
  };

  const handleRemoveTag = (tagId: number) => {
    const currentTags = form.getValues("tag_ids") || [];
    form.setValue("tag_ids", currentTags.filter(id => id !== tagId));
  };

  return (
    <FormField
      control={form.control}
      name="tag_ids"
      render={() => (
        <FormItem className="space-y-4">
          <FormLabel className="text-lg font-semibold flex items-center gap-2 text-white">
            <Tag className="h-5 w-5" />
            Tags
          </FormLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {PREDEFINED_TAGS.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                className={`cursor-pointer text-sm py-1.5 justify-center transition-colors ${
                  selectedTags.includes(tag.id)
                    ? "bg-[#ea384c] text-white hover:bg-[#ea384c]/90"
                    : "border-[#ea384c] text-white hover:bg-[#ea384c]/10"
                }`}
                onClick={() => handleTagSelect(tag.id.toString())}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          <div className="mt-4">
            <Select onValueChange={handleTagSelect}>
              <FormControl>
                <SelectTrigger 
                  className="h-10 bg-[#333333] border-[#ea384c] text-white"
                >
                  <SelectValue placeholder="Add custom tag" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-[#333333] border-[#ea384c]">
                {tags?.map((tag) => (
                  <SelectItem 
                    key={tag.id} 
                    value={tag.id.toString()}
                    className="text-white cursor-pointer hover:bg-[#ea384c]/10 focus:bg-[#ea384c]/10"
                  >
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selectedTags.map((tagId) => {
              const tag = [...(tags || []), ...PREDEFINED_TAGS].find(t => t.id === tagId);
              if (!tag) return null;
              return (
                <Badge 
                  key={tag.id} 
                  className="px-2 py-1 text-sm bg-[#333333] text-white border border-[#ea384c] hover:bg-[#444444]"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    className="ml-1.5 hover:text-[#ea384c] focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
          <FormMessage className="text-[#ea384c]" />
        </FormItem>
      )}
    />
  );
};