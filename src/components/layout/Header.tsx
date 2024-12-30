import { HeaderLogo } from "./header/HeaderLogo";
import { HeaderNavigation } from "./header/HeaderNavigation";
import { HeaderSearch } from "./header/HeaderSearch";
import { HeaderAuth } from "./header/HeaderAuth";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black shadow-md">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-2">
          <HeaderLogo />
          <HeaderNavigation />
          <div className="flex items-center gap-2 text-white">
            <HeaderSearch />
            <HeaderAuth />
          </div>
        </div>
      </div>
    </header>
  );
};