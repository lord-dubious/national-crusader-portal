import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const HeaderNavigation = () => {
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
  );
};