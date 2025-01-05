import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AdminHeaderActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBackup = async () => {
    try {
      // Call the Edge Function to create and store the backup
      const { data, error } = await supabase.functions.invoke('create-backup', {
        method: 'POST',
      });

      if (error) throw error;

      toast({
        title: "Backup created successfully",
        description: `Database backup has been created and stored as ${data.fileName}`,
      });
    } catch (error) {
      console.error('Backup error:', error);
      toast({
        variant: "destructive",
        title: "Backup failed",
        description: "There was an error creating the database backup.",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
      <Button 
        onClick={() => navigate('/admin/new-article')}
        className="w-full md:w-auto bg-[#DC2626] text-white hover:bg-[#DC2626]/90"
      >
        Create New Article
      </Button>
      <Button
        onClick={handleBackup}
        className="w-full md:w-auto bg-[#4B5563] text-white hover:bg-[#4B5563]/90 flex items-center gap-2"
      >
        <Database className="h-4 w-4" />
        Backup Database
      </Button>
    </div>
  );
};