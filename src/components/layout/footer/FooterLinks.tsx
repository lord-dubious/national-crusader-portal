import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const FooterLinks = () => {
  const { data: categories } = useQuery({
    queryKey: ["footer-categories"],
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary-foreground">About Us</h3>
        <p className="text-sm text-primary-foreground/70">
          National Crusader delivers the latest news with integrity and precision.
          Our commitment to truth and accuracy sets us apart in today's fast-paced
          media landscape.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary-foreground">Categories</h3>
        <ul className="space-y-2">
          {categories?.map((category) => (
            <li key={category.id}>
              <Link 
                to={`/category/${category.slug}`} 
                className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary-foreground">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <Link to="/about" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/privacy" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};