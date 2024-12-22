import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const HeaderAuth = () => {
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return profile;
    },
  });

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      window.location.href = "/";
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner if you prefer
  }

  if (!profile) {
    return (
      <div className="hidden lg:flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-primary-foreground bg-primary border-primary-foreground hover:bg-accent hover:text-accent-foreground" 
          asChild
        >
          <Link to="/signin">Sign In</Link>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-primary-foreground bg-primary border-primary-foreground hover:bg-accent hover:text-accent-foreground" 
          asChild
        >
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary-foreground">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuLabel className="text-sm font-normal text-muted-foreground">
          {profile.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profile.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link to="/admin">Admin Dashboard</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};