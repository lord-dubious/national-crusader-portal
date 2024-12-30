import { Link } from "react-router-dom";
import { MobileMenu } from "../MobileMenu";

export const HeaderLogo = () => {
  return (
    <div className="flex items-center gap-4 flex-shrink-0">
      <MobileMenu />
      <Link
        to="/"
        className="text-xl font-bold text-white hover:text-accent transition-colors whitespace-nowrap"
      >
        National Crusader
      </Link>
    </div>
  );
};