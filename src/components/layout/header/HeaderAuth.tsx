import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export const HeaderAuth = () => {
  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <Button 
        variant="outline" 
        className="border-black bg-black text-white hover:bg-black/90 hover:text-white transition-colors" 
        asChild
      >
        <Link to="/signin">Sign In</Link>
      </Button>
      <Button 
        className="bg-black text-white hover:bg-black/90 transition-colors" 
        asChild
      >
        <Link to="/signup">Sign Up</Link>
      </Button>
    </div>
  );
};