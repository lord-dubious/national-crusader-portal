import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileMenu } from "./MobileMenu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const Header = () => {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email === 'admin@nationalcrusader.com') {
        setIsAdmin(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.email === 'admin@nationalcrusader.com') {
        setIsAdmin(true);
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
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-md">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-shrink-0">
            <MobileMenu />
            <Link
              to="/"
              className="text-xl font-bold text-primary-foreground hover:text-accent transition-colors whitespace-nowrap"
            >
              National Crusader
            </Link>
          </div>
          
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center gap-x-1">
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-[clamp(0.75rem,1.2vw,0.875rem)] text-primary-foreground hover:text-accent transition-colors whitespace-nowrap px-2 py-1"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex relative w-40">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-foreground/50" />
            </div>
            <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground">
              <Search className="h-5 w-5" />
            </Button>
            
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
        </div>
      </div>
    </header>
  );
};