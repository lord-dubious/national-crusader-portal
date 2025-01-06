import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Tag } from "./types";

interface TagListProps {
  tags: Tag[];
  onEdit: (tag: Tag) => void;
  onDelete: (id: number) => void;
}

export const TagList = ({ tags, onEdit, onDelete }: TagListProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-600">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Slug</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-[#2A2A2A]">
                <td className="px-4 py-2">{tag.name}</td>
                <td className="px-4 py-2">{tag.slug}</td>
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(tag)}
                      className="hover:bg-[#DC2626] hover:text-white p-1 h-auto"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this tag?")) {
                          onDelete(tag.id);
                        }
                      }}
                      className="hover:bg-[#DC2626] hover:text-white p-1 h-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};