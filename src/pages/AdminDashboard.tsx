import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { RecentArticles } from "@/components/admin/dashboard/RecentArticles";
import { UserManagement } from "@/components/admin/UserManagement";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { SiteSettings } from "@/components/admin/SiteSettings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Users, Image, FolderTree, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => navigate('/admin/new-article')}>
          Create New Article
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-8">
        <TabsList className="grid grid-cols-5 w-full md:w-auto">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Media
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-8">
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

        <TabsContent value="settings">
          <SiteSettings />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;