import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Archive, Eye, EyeOff, Trash2 } from "lucide-react";

interface Newspaper {
  id: number;
  title: string;
  status: string;
}

interface NewspaperListProps {
  newspapers: Newspaper[];
  onUpdate: () => void;
}

export const NewspaperList = ({ newspapers, onUpdate }: NewspaperListProps) => {
  const { toast } = useToast();

  const updateStatus = async (id: number, status: 'published' | 'archived' | 'hidden') => {
    try {
      const { error } = await supabase
        .from('newspapers')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      onUpdate();
      toast({
        title: "Status updated",
        description: `Newspaper has been ${status}.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message
      });
    }
  };

  const deletePDF = async (id: number) => {
    try {
      const { error } = await supabase
        .from('newspapers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      onUpdate();
      toast({
        title: "PDF deleted",
        description: "The newspaper has been deleted successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message
      });
    }
  };

  return (
    <div className="space-y-4">
      {newspapers?.map((newspaper) => (
        <div
          key={newspaper.id}
          className="flex items-center justify-between p-4 bg-[#333333] rounded-lg"
        >
          <div className="flex-1">
            <h3 className="text-white font-medium">{newspaper.title}</h3>
            <p className="text-sm text-gray-400">
              Status: {newspaper.status}
            </p>
          </div>
          <div className="flex gap-2">
            {newspaper.status !== 'published' && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateStatus(newspaper.id, 'published')}
                className="bg-[#444444] border-[#555555] hover:bg-[#DC2626] text-white"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {newspaper.status === 'published' && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateStatus(newspaper.id, 'hidden')}
                className="bg-[#444444] border-[#555555] hover:bg-[#DC2626] text-white"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateStatus(newspaper.id, 'archived')}
              className="bg-[#444444] border-[#555555] hover:bg-[#DC2626] text-white"
            >
              <Archive className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => deletePDF(newspaper.id)}
              className="bg-[#DC2626] hover:bg-[#DC2626]/80"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};