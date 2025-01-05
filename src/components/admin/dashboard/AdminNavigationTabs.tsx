import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Users, Image, FolderTree, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const AdminNavigationTabs = () => {
  const isMobile = useIsMobile();

  return (
    <TabsList className="w-full bg-[#222222] p-1 flex flex-wrap gap-1 overflow-x-auto">
      <TabsTrigger 
        value="dashboard" 
        className="flex-1 md:flex-none min-w-[40px] flex items-center gap-2 data-[state=active]:bg-[#DC2626] data-[state=active]:text-white hover:bg-[#DC2626]/70"
      >
        <LayoutDashboard className="h-4 w-4" />
        <span className={isMobile ? "hidden" : "inline"}>Dashboard</span>
      </TabsTrigger>
      <TabsTrigger 
        value="users" 
        className="flex-1 md:flex-none min-w-[40px] flex items-center gap-2 data-[state=active]:bg-[#DC2626] data-[state=active]:text-white hover:bg-[#DC2626]/70"
      >
        <Users className="h-4 w-4" />
        <span className={isMobile ? "hidden" : "inline"}>Users</span>
      </TabsTrigger>
      <TabsTrigger 
        value="media" 
        className="flex-1 md:flex-none min-w-[40px] flex items-center gap-2 data-[state=active]:bg-[#DC2626] data-[state=active]:text-white hover:bg-[#DC2626]/70"
      >
        <Image className="h-4 w-4" />
        <span className={isMobile ? "hidden" : "inline"}>Media</span>
      </TabsTrigger>
      <TabsTrigger 
        value="categories" 
        className="flex-1 md:flex-none min-w-[40px] flex items-center gap-2 data-[state=active]:bg-[#DC2626] data-[state=active]:text-white hover:bg-[#DC2626]/70"
      >
        <FolderTree className="h-4 w-4" />
        <span className={isMobile ? "hidden" : "inline"}>Categories</span>
      </TabsTrigger>
      <TabsTrigger 
        value="settings" 
        className="flex-1 md:flex-none min-w-[40px] flex items-center gap-2 data-[state=active]:bg-[#DC2626] data-[state=active]:text-white hover:bg-[#DC2626]/70"
      >
        <Settings className="h-4 w-4" />
        <span className={isMobile ? "hidden" : "inline"}>Settings</span>
      </TabsTrigger>
    </TabsList>
  );
};