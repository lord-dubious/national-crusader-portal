import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, FolderTree, Tags, Image as ImageIcon, Users, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Articles", url: "/admin/articles", icon: FileText },
  { title: "Categories", url: "/admin/categories", icon: FolderTree },
  { title: "Tags", url: "/admin/tags", icon: Tags },
  { title: "Media", url: "/admin/media", icon: ImageIcon },
  { title: "Users", url: "/admin/users", icon: Users },
];

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isOpen, setOpen } = useSidebar();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return;
    }
    navigate('/');
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    });
  };

  const handleNavigation = (url: string) => {
    navigate(url);
    // Remove this line to prevent auto-closing the sidebar
    // setOpen(false);
  };

  return (
    <Sidebar className="bg-[#222222] border-r border-[#333333]">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-2">
            <SidebarGroupLabel className="text-[#8E9196]">Admin Panel</SidebarGroupLabel>
            <SidebarTrigger className="text-white hover:text-accent" />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.url)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-white hover:bg-accent transition-colors",
                      location.pathname === item.url && "bg-accent"
                    )}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-white hover:bg-accent transition-colors"
                  tooltip="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};