import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <a href="/" className="text-xl font-bold">
            National Crusader
          </a>
        </div>
        <nav className="hidden lg:flex items-center space-x-8">
          <a href="/politics" className="hover:text-accent transition-colors">
            Politics
          </a>
          <a href="/business" className="hover:text-accent transition-colors">
            Business
          </a>
          <a href="/technology" className="hover:text-accent transition-colors">
            Technology
          </a>
          <a href="/culture" className="hover:text-accent transition-colors">
            Culture
          </a>
        </nav>
      </div>
    </header>
  );
};