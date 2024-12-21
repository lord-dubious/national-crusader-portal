import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-md">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="lg:hidden text-primary-foreground">
              <Menu className="h-6 w-6" />
            </Button>
            <a href="/" className="text-2xl font-bold text-primary-foreground hover:text-accent transition-colors">
              National Crusader
            </a>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="/politics" className="text-primary-foreground hover:text-accent transition-colors">
              Politics
            </a>
            <a href="/business" className="text-primary-foreground hover:text-accent transition-colors">
              Business
            </a>
            <a href="/technology" className="text-primary-foreground hover:text-accent transition-colors">
              Technology
            </a>
            <a href="/culture" className="text-primary-foreground hover:text-accent transition-colors">
              Culture
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex relative">
              <Input
                type="search"
                placeholder="Search articles..."
                className="w-64 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-foreground/50" />
            </div>
            <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground">
              <Search className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};