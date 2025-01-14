import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronsUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArticleFormValues } from "../types";
import { cn } from "@/lib/utils";

export const ArticleTags = () => {
  const [open, setOpen] = useState(false);
  const form = useFormContext<ArticleFormValues>();
  const { toast } = useToast();
  const selectedTags = form.watch("tags") || [];

  const { data: existingTags, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data || []; // Ensure we always return an array
    },
  });

  const handleSelectTag = (tagId: number) => {
    if (!selectedTags.includes(tagId)) {
      const updatedTags = [...selectedTags, tagId];
      form.setValue("tags", updatedTags);
      setOpen(false);
      
      toast({
        title: "Success",
        description: "Tag added successfully",
      });
    } else {
      toast({
        title: "Info",
        description: "This tag is already added to the article",
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
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between bg-[#2A2F3E] border-gray-600 text-white hover:bg-[#363d4f]"
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading tags..." : "Select tags..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-[#2A2F3E] border-gray-600">
                    {existingTags && existingTags.length > 0 ? (
                      <Command className="bg-transparent">
                        <CommandInput 
                          placeholder="Search tags..." 
                          className="text-white placeholder:text-gray-400"
                        />
                        <CommandEmpty className="text-gray-400 p-2">No tags found.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-auto">
                          {existingTags.map((tag) => (
                            <CommandItem
                              key={tag.id}
                              value={tag.name}
                              onSelect={() => handleSelectTag(tag.id)}
                              className={cn(
                                "text-white hover:bg-[#363d4f]",
                                selectedTags.includes(tag.id) && "bg-[#363d4f]"
                              )}
                            >
                              {tag.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    ) : (
                      <div className="p-4 text-sm text-gray-400">
                        {isLoading ? "Loading tags..." : "No tags available"}
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-gray-600 rounded-md">
                  {selectedTags.map((tagId) => {
                    const tag = existingTags?.find((t) => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <Badge 
                        key={tag.id}
                        variant="secondary"
                        className="flex items-center gap-1 bg-accent text-accent-foreground"
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