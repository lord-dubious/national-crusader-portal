import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";

export const HeaderAuth = () => {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {profile ? (
        <>
          {(profile.role === "admin" || profile.role === "editor") && (
            <Link to="/admin">
              <Button variant="ghost" className="text-white hover:text-accent">
                Dashboard
              </Button>
            </Link>
          )}
          <Link to="/profile">
            <Button variant="ghost" className="text-white hover:text-accent">
              Profile
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Link to="/sign-in">
            <Button variant="ghost" className="text-white hover:text-accent">
              Sign In
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button variant="ghost" className="text-white hover:text-accent">
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};