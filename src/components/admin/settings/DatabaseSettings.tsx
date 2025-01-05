import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const DatabaseSettings = () => {
  const [dbUrl, setDbUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInitializeDatabase = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('initialize-local-db', {
        body: { dbUrl }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Local database initialized successfully",
      });
    } catch (error) {
      console.error('Error initializing database:', error);
      toast({
        title: "Error",
        description: "Failed to initialize local database. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-card p-6 rounded-lg border">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Local Database Setup</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure a local PostgreSQL database for development. This will create all necessary tables, 
          storage buckets, and initial data.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dbUrl">PostgreSQL Connection URL</Label>
          <Input
            id="dbUrl"
            placeholder="postgresql://username:password@localhost:5432/database"
            value={dbUrl}
            onChange={(e) => setDbUrl(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Format: postgresql://username:password@localhost:5432/database
          </p>
        </div>

        <Button 
          onClick={handleInitializeDatabase} 
          disabled={!dbUrl || isLoading}
          className="w-full"
        >
          {isLoading ? "Initializing..." : "Initialize Local Database"}
        </Button>
      </div>
    </div>
  );
};