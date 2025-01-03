import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  onOpenSearch: () => void;
}

export const SearchInput = ({ onOpenSearch }: SearchInputProps) => {
  return (
    <>
      <div className="hidden md:flex relative w-40">
        <Input
          type="search"
          placeholder="Search..."
          className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
          onClick={onOpenSearch}
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden text-white hover:text-accent"
        onClick={onOpenSearch}
      >
        <Search className="h-5 w-5" />
      </Button>
    </>
  );
};