import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileMenu } from "./MobileMenu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export const Header = () => {
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
          
          <nav className="hidden lg:flex items-center overflow-x-auto">
            <ul className="flex items-center gap-x-4">
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-sm text-primary-foreground hover:text-accent transition-colors whitespace-nowrap px-2 py-1"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex relative w-48 lg:w-56">
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
            <Link
              to="/admin"
              className="text-sm text-primary-foreground hover:text-accent transition-colors whitespace-nowrap ml-4"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};