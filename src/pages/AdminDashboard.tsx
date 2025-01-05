import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { RecentArticles } from "@/components/admin/dashboard/RecentArticles";
import { UserManagement } from "@/components/admin/UserManagement";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { SiteSettings } from "@/components/admin/SiteSettings";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Users, Image, FolderTree, Settings, Database } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Extract article ID from URL if editing
  const articleId = location.pathname.match(/\/admin\/edit-article\/(\d+)/)?.[1];

  const handleBackup = async () => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `backup-${timestamp}.sql`;
      
      const { data, error } = await supabase.storage
        .from('db_backups')
        .upload(backupName, '', {
          contentType: 'application/sql'
        });

      if (error) throw error;

      toast({
        title: "Backup initiated",
        description: "Database backup has been initiated successfully.",
      });
    } catch (error) {
      console.error('Backup error:', error);
      toast({
        variant: "destructive",
        title: "Backup failed",
        description: "There was an error creating the database backup.",
      });
    }
  };

  return (
    <AdminLayout>
      {location.pathname === '/admin/new-article' ? (
        <ArticleForm />
      ) : articleId ? (
        <ArticleForm articleId={articleId} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {!isMobile && (
              <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
            )}
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <Button 
                onClick={() => navigate('/admin/new-article')}
                className="w-full md:w-auto bg-[#DC2626] text-white hover:bg-[#DC2626]/90"
              >
                Create New Article
              </Button>
              <Button
                onClick={handleBackup}
                className="w-full md:w-auto bg-[#4B5563] text-white hover:bg-[#4B5563]/90 flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                Backup Database
              </Button>
            </div>
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

              <TabsContent value="settings">
                <SiteSettings />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;