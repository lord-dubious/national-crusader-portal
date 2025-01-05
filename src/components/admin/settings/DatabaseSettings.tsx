import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const DatabaseSettings = () => {
  const [dbUrl, setDbUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useLocalDb, setUseLocalDb] = useState(false);
  const { toast } = useToast();

  const handleInitializeDatabase = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('initialize-local-db', {
        body: { dbUrl }
      });

      if (error) throw error;

      // Store the local database URL in localStorage
      if (useLocalDb) {
        localStorage.setItem('supabaseUrl', 'http://localhost:54321');
        localStorage.setItem('supabaseAnonKey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0');
        
        // Reload the page to apply new database settings
        window.location.reload();
      }

      toast({
        title: "Success",
        description: "Local database initialized successfully",
      });

      toast({
        title: "Action Required",
        description: "Don't forget to create the required storage buckets in your local Supabase instance",
      });
    } catch (error: any) {
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

  const handleDatabaseToggle = (checked: boolean) => {
    setUseLocalDb(checked);
    if (!checked) {
      // Reset to remote database
      localStorage.removeItem('supabaseUrl');
      localStorage.removeItem('supabaseAnonKey');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 bg-card p-6 rounded-lg border">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Database Settings</h3>
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="database-toggle"
            checked={useLocalDb}
            onCheckedChange={handleDatabaseToggle}
          />
          <Label htmlFor="database-toggle">Use Local Database</Label>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {useLocalDb 
            ? "Configure a local PostgreSQL database for development. This will create all necessary tables, functions, triggers, and RLS policies."
            : "Currently using remote Supabase database."
          }
        </p>
      </div>

      {useLocalDb && (
        <>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This will set up:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All database tables with proper relations</li>
                <li>Search functionality and triggers</li>
                <li>Row Level Security (RLS) policies</li>
                <li>Required database functions</li>
              </ul>
              <p className="mt-2 font-medium">
                Note: You'll need to manually create these storage buckets in your local Supabase instance:
              </p>
              <ul className="list-disc list-inside mt-1">
                <li>media (public)</li>
                <li>pdf_newspapers (public)</li>
                <li>db_backups (private)</li>
              </ul>
            </AlertDescription>
          </Alert>

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
        </>
      )}
    </div>
  );
};