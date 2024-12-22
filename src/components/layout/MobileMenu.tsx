import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) {
        const { data } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', session.user.email)
          .single();
        
        setIsAdmin(!!data);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user?.email) {
        const { data } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', session.user.email)
          .single();
        
        setIsAdmin(!!data);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-primary-foreground">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] bg-primary p-0">
        <nav className="h-full flex flex-col py-6">
          <Link
            to="/"
            className="px-6 py-2 text-lg font-semibold text-primary-foreground hover:text-accent transition-colors"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <div className="mt-4">
            {categories?.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="block px-6 py-2 text-base text-primary-foreground hover:text-accent transition-colors"
                onClick={() => setOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
          <div className="mt-auto px-6">
            {session ? (
              <div className="flex flex-col gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-base text-primary-foreground hover:text-accent transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-primary-foreground hover:text-accent justify-start px-0"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/signin"
                  className="text-base text-primary-foreground hover:text-accent transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-base text-primary-foreground hover:text-accent transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};