import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Database, Info } from "lucide-react";

export const DatabaseSettings = () => {
  const [useLocalDb, setUseLocalDb] = useState(false);
  const [dbUrl, setDbUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedUseLocalDb = localStorage.getItem("useLocalDb") === "true";
    const savedDbUrl = localStorage.getItem("dbUrl") || "";
    setUseLocalDb(savedUseLocalDb);
    setDbUrl(savedDbUrl);
  }, []);

  const handleToggleLocalDb = (checked: boolean) => {
    setUseLocalDb(checked);
    localStorage.setItem("useLocalDb", String(checked));

    toast({
      title: checked ? "Using Local Database" : "Using Production Database",
      description: checked
        ? "Switched to local Supabase instance"
        : "Switched to production Supabase instance",
    });

    // Add a slight delay before reloading to ensure the toast is visible
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleSaveDbUrl = () => {
    if (!dbUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a database URL",
      });
      return;
    }

    localStorage.setItem("dbUrl", dbUrl);
    toast({
      title: "Database URL Saved",
      description: "The database connection URL has been updated",
    });

    // Add a slight delay before reloading to ensure the toast is visible
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between p-4 bg-secondary/20 backdrop-blur-md rounded-lg border border-secondary/30">
          <div className="flex items-center space-x-4">
            <Database className="h-6 w-6 text-accent" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Database Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Toggle between local and production database
              </p>
            </div>
          </div>
          <Switch
            checked={useLocalDb}
            onCheckedChange={handleToggleLocalDb}
            className="data-[state=checked]:bg-accent"
          />
        </div>

        <div className="space-y-4 p-4 bg-secondary/20 backdrop-blur-md rounded-lg border border-secondary/30">
          <Alert className="border-accent/20 bg-secondary/30">
            <Info className="h-4 w-4 text-accent" />
            <AlertTitle className="text-foreground">Local Database Setup</AlertTitle>
            <AlertDescription>
              <p className="mb-2 text-muted-foreground">This will set up your local Supabase instance with:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                <li>Database tables and relations</li>
                <li>Row Level Security (RLS) policies</li>
                <li>Search functionality</li>
                <li>Initial seed data</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label htmlFor="dbUrl" className="text-sm font-medium text-foreground">
              PostgreSQL Connection URL
            </label>
            <Input
              id="dbUrl"
              type="text"
              placeholder="postgresql://postgres:your-password@localhost:54322/postgres"
              value={dbUrl}
              onChange={(e) => setDbUrl(e.target.value)}
              className="bg-background/50 text-foreground border-secondary/30"
            />
            <p className="text-sm text-muted-foreground">
              The connection URL for your local Supabase instance's PostgreSQL database
            </p>
          </div>

          <Button
            onClick={handleSaveDbUrl}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Save Database URL
          </Button>
        </div>
      </div>
    </div>
  );
};