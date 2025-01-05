import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

export const HeaderAuth = () => {
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user.id) {
        fetchUserRole(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user.id) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return;
    }

    if (data) {
      setUserRole(data.role);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const authButtons = !session ? (
    <>
      <Button 
        variant="outline" 
        className="border-accent bg-black text-white hover:bg-accent hover:text-white transition-colors" 
        asChild
      >
        <Link to="/signin">Sign In</Link>
      </Button>
      <Button 
        className="bg-black border border-accent text-white hover:bg-accent hover:text-white transition-colors" 
        asChild
      >
        <Link to="/signup">Sign Up</Link>
      </Button>
    </>
  ) : (
    <div className="flex items-center gap-4">
      {userRole === 'admin' && (
        <Button 
          variant="outline"
          className="border-accent bg-black text-white hover:bg-accent hover:text-white transition-colors"
          asChild
        >
          <Link to="/admin">Admin Dashboard</Link>
        </Button>
      )}
      <Button 
        className="bg-black border border-accent text-white hover:bg-accent hover:text-white transition-colors"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );

  return (
    <div className={`flex items-center gap-4 ${isMobile ? 'hidden lg:flex' : ''}`}>
      <ThemeToggle />
      {authButtons}
    </div>
  );
};