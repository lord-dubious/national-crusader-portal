import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const MobileMenu = () => {
  const [open, setOpen] = useState(false);
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
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      setOpen(false);
      window.location.href = "/";
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-white">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] bg-black border-r border-white/10 p-0">
        <nav className="h-full flex flex-col py-6">
          <Link
            to="/"
            className="px-6 py-2 text-lg font-semibold text-white hover:text-accent transition-colors"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <div className="mt-4">
            {categories?.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="block px-6 py-2 text-base text-white hover:text-accent transition-colors"
                onClick={() => setOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
          <div className="mt-auto px-6">
            {profile ? (
              <div className="flex flex-col gap-2">
                {profile.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-base text-white hover:text-accent transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="text-base text-white hover:text-accent transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-white hover:text-accent justify-start px-0"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/signin"
                  className="text-base text-white hover:text-accent transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-base text-white hover:text-accent transition-colors"
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