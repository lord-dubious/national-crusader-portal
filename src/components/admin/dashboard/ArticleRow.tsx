import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ArticleRowProps } from "./types";

export const ArticleRow = ({ article, onEdit, onDelete }: ArticleRowProps) => {
  return (
    <tr className="hover:bg-[#2A2A2A] text-white">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-medium">{article.title}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span>{article.author?.email}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span>{article.category?.name || 'Uncategorized'}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          article.status === 'published' 
            ? 'bg-green-900 text-green-200' 
            : 'bg-yellow-900 text-yellow-200'
        }`}>
          {article.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(article.id)}
            className="hover:bg-[#DC2626] hover:text-white"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this article?')) {
                onDelete(article.id);
              }
            }}
            className="hover:bg-[#DC2626] hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};