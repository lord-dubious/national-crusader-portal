import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export const HeaderAuth = () => {
  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <Button 
        variant="outline" 
        className="border-accent text-white bg-black hover:bg-accent hover:text-white" 
        asChild
      >
        <Link to="/signin">Sign In</Link>
      </Button>
      <Button 
        variant="active" 
        className="bg-accent text-white hover:bg-accent/90" 
        asChild
      >
        <Link to="/signup">Sign Up</Link>
      </Button>
    </div>
  );
};