import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { RecentArticles } from "@/components/admin/dashboard/RecentArticles";
import { UserManagement } from "@/components/admin/UserManagement";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { SiteSettings } from "@/components/admin/SiteSettings";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminHeaderActions } from "@/components/admin/dashboard/AdminHeaderActions";
import { AdminNavigationTabs } from "@/components/admin/dashboard/AdminNavigationTabs";
import { ArticlesManagement } from "@/components/admin/ArticlesManagement";

export const AdminDashboard = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Extract article ID from URL if editing
  const articleId = location.pathname.match(/\/admin\/edit-article\/(\d+)/)?.[1];

  // Determine which tab should be active based on the current path
  const getActiveTab = () => {
    if (location.pathname === '/admin') return 'dashboard';
    if (location.pathname.includes('/admin/articles')) return 'articles';
    if (location.pathname.includes('/admin/categories')) return 'categories';
    if (location.pathname.includes('/admin/users')) return 'users';
    if (location.pathname.includes('/admin/media')) return 'media';
    if (location.pathname.includes('/admin/settings')) return 'settings';
    return 'dashboard';
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
            <AdminHeaderActions />
          </div>

          <Tabs defaultValue={getActiveTab()} className="w-full">
            <AdminNavigationTabs />

            <div className="mt-4 md:mt-8">
              <TabsContent value="dashboard" className="space-y-4 md:space-y-8">
                <DashboardStats />
                <RecentArticles />
              </TabsContent>

              <TabsContent value="articles">
                <ArticlesManagement />
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