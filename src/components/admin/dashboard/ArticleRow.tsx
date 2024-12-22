import { Button } from "@/components/ui/button";
import { Archive, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { ArticleRowProps } from "./types";

export const ArticleRow = ({ article, onEdit, onArchive, onHide, onDelete }: ArticleRowProps) => {
  return (
    <tr className="hover:bg-[#2A2A2A] text-white">
      <td className="px-2 py-2 whitespace-normal">
        <span className="font-medium line-clamp-2">{article.title}</span>
      </td>
      <td className="px-2 py-2 whitespace-nowrap hidden md:table-cell">
        <span className="line-clamp-1">{article.author?.email}</span>
      </td>
      <td className="px-2 py-2 whitespace-nowrap hidden lg:table-cell">
        <span>{article.category?.name || 'Uncategorized'}</span>
      </td>
      <td className="px-2 py-2 whitespace-nowrap">
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
          article.status === 'published' 
            ? 'bg-green-900 text-green-200'
            : article.status === 'archived'
            ? 'bg-gray-900 text-gray-200'
            : article.status === 'hidden'
            ? 'bg-purple-900 text-purple-200'
            : 'bg-yellow-900 text-yellow-200'
        }`}>
          <span className="hidden sm:inline">{article.status}</span>
          <span className="sm:hidden">{article.status.charAt(0).toUpperCase()}</span>
        </span>
      </td>
      <td className="px-2 py-2 whitespace-nowrap">
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(article.id)}
            className="hover:bg-[#DC2626] hover:text-white p-1 h-auto"
            title="Edit"
          >
            <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onArchive(article.id)}
            className="hover:bg-[#DC2626] hover:text-white p-1 h-auto"
            title="Archive"
          >
            <Archive className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onHide(article.id)}
            className="hover:bg-[#DC2626] hover:text-white p-1 h-auto"
            title={article.status === 'hidden' ? 'Show' : 'Hide'}
          >
            {article.status === 'hidden' ? (
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this article?')) {
                onDelete(article.id);
              }
            }}
            className="hover:bg-[#DC2626] hover:text-white p-1 h-auto"
            title="Delete"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};