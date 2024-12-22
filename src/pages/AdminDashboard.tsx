import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { RecentArticles } from "@/components/admin/dashboard/RecentArticles";
import { UserManagement } from "@/components/admin/UserManagement";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { SiteSettings } from "@/components/admin/SiteSettings";
import { NewspaperManagement } from "@/components/admin/NewspaperManagement";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Users, Image, FolderTree, Settings, Newspaper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {!isMobile && (
            <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
          )}
          <Button 
            onClick={() => navigate('/admin/new-article')}
            className="w-full md:w-auto bg-[#DC2626] text-white hover:bg-[#DC2626]/90"
          >
            Create New Article
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
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
              value="newspapers" 
              className="flex-1 md:flex-none min-w-[40px] flex items-center gap-2 data-[state=active]:bg-[#DC2626] data-[state=active]:text-white hover:bg-[#DC2626]/70"
            >
              <Newspaper className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Newspapers</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex-1 md:flex-none min-w-[40px] flex items-center gap-2 data-[state=active]:bg-[#DC2626] data-[state=active]:text-white hover:bg-[#DC2626]/70"
            >
              <Settings className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Settings</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 md:mt-8">
            <TabsContent value="dashboard" className="space-y-4 md:space-y-8">
              <DashboardStats />
              <RecentArticles />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="media">
              <MediaLibrary />
            </TabsContent>

            <TabsContent value="categories">
              <CategoryManagement />
            </TabsContent>

            <TabsContent value="newspapers">
              <NewspaperManagement />
            </TabsContent>

            <TabsContent value="settings">
              <SiteSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;