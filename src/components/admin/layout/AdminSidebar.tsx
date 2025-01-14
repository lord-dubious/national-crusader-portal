import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, FolderTree, Tags, Image as ImageIcon, Users, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Sidebar className="bg-[#222222] border-r border-[#333333]">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-2">
            <SidebarGroupLabel className="text-[#8E9196]">Admin Panel</SidebarGroupLabel>
            <SidebarTrigger className="text-white hover:text-accent fixed right-4 z-50" />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <button
                    onClick={() => navigate(item.url)}
                    className={cn(
                      "flex w-full items-center gap-2 px-4 py-2 rounded-md text-white hover:bg-accent transition-colors",
                      location.pathname === item.url && "bg-accent"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </button>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 rounded-md text-white hover:bg-accent transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};