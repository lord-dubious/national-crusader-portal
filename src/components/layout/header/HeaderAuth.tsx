import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export const HeaderAuth = () => {
  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <Button variant="ghost" asChild>
        <Link to="/signin">Sign In</Link>
      </Button>
      <Button asChild>
        <Link to="/signup">Sign Up</Link>
      </Button>
    </div>
  );
};