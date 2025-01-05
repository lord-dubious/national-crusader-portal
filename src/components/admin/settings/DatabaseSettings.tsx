import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Database } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const DatabaseSettings = () => {
  const [dbUrl, setDbUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useLocalDb, setUseLocalDb] = useState(
    localStorage.getItem('supabaseUrl') === 'http://localhost:54321'
  );
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
        
        toast({
          title: "Success",
          description: "Local database settings saved. The page will reload to apply changes.",
        });

        // Reload the page to apply new database settings
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error: any) {
      console.error('Error initializing database:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to initialize local database",
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
      
      toast({
        title: "Success",
        description: "Switched to remote database. The page will reload to apply changes.",
      });

      setTimeout(() => window.location.reload(), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
          <div className="flex items-center space-x-4">
            <Database className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-medium">Database Connection</h3>
              <p className="text-sm text-muted-foreground">
                {useLocalDb ? "Using local database" : "Using remote database"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="db-toggle">Use Local Database</Label>
            <Switch
              id="db-toggle"
              checked={useLocalDb}
              onCheckedChange={handleDatabaseToggle}
            />
          </div>
        </div>

        {useLocalDb && (
          <div className="space-y-4 p-4 bg-card rounded-lg border">
            <Alert variant="info" className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Local Database Setup</AlertTitle>
              <AlertDescription>
                <p className="mb-2">This will set up your local Supabase instance with:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Database tables and relations</li>
                  <li>Row Level Security (RLS) policies</li>
                  <li>Search functionality</li>
                  <li>Required storage buckets</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="dbUrl">PostgreSQL Connection URL</Label>
              <Input
                id="dbUrl"
                placeholder="postgresql://postgres:your-password@localhost:54322/postgres"
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                The connection URL for your local Supabase instance's PostgreSQL database
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
        )}
      </div>
    </div>
  );
};