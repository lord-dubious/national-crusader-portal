import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const HeaderAuth = () => {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setIsAdmin(profile?.role === 'admin');
  }, [profile]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex items-center gap-2">
      {session ? (
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm text-primary-foreground hover:text-accent transition-colors whitespace-nowrap ml-4"
            >
              Admin
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-primary-foreground hover:text-accent ml-2"
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to="/signin"
            className="text-sm text-primary-foreground hover:text-accent transition-colors whitespace-nowrap ml-4"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="text-sm text-primary-foreground hover:text-accent transition-colors whitespace-nowrap ml-2"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};