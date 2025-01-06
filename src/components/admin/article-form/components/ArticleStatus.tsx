import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useFormContext } from "react-hook-form";
import { ArticleFormValues } from "../types";

export const ArticleStatus = () => {
  const form = useFormContext<ArticleFormValues>();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400";
      case "review":
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400";
      case "published":
        return "bg-green-500/20 text-green-600 dark:text-green-400";
      case "archived":
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Status</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || "draft"}
          >
            <FormControl>
              <SelectTrigger className="bg-[#2A2F3E] border-gray-600 text-white">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={getStatusColor(field.value || "draft")}>
                      {field.value || "draft"}
                    </Badge>
                  </div>
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-[#2A2F3E] border-gray-600">
              <SelectItem 
                value="draft"
                className="text-white hover:bg-[#3A3F4E]"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getStatusColor("draft")}>
                    Draft
                  </Badge>
                  <span className="text-sm text-gray-400">- Save as a draft</span>
                </div>
              </SelectItem>
              <SelectItem 
                value="review"
                className="text-white hover:bg-[#3A3F4E]"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getStatusColor("review")}>
                    Review
                  </Badge>
                  <span className="text-sm text-gray-400">- Submit for review</span>
                </div>
              </SelectItem>
              <SelectItem 
                value="published"
                className="text-white hover:bg-[#3A3F4E]"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getStatusColor("published")}>
                    Published
                  </Badge>
                  <span className="text-sm text-gray-400">- Make public</span>
                </div>
              </SelectItem>
              <SelectItem 
                value="archived"
                className="text-white hover:bg-[#3A3F4E]"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getStatusColor("archived")}>
                    Archived
                  </Badge>
                  <span className="text-sm text-gray-400">- Move to archives</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};