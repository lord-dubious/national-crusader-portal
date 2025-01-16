import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { RecentArticles } from "@/components/admin/dashboard/RecentArticles";
import { UserManagement } from "@/components/admin/UserManagement";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { TagManagement } from "@/components/admin/TagManagement";
import { SiteSettings } from "@/components/admin/SiteSettings";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminHeaderActions } from "@/components/admin/dashboard/AdminHeaderActions";
import { AdminNavigationTabs } from "@/components/admin/dashboard/AdminNavigationTabs";
import { ArticlesManagement } from "@/components/admin/ArticlesManagement";

export const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Extract article ID from URL if editing
  const articleId = location.pathname.match(/\/admin\/edit-article\/(\d+)/)?.[1];

  // Determine which tab should be active based on the current path
  const getActiveTab = () => {
    if (location.pathname === '/admin') return 'dashboard';
    if (location.pathname === '/admin/articles') return 'articles';
    if (location.pathname === '/admin/categories') return 'categories';
    if (location.pathname === '/admin/tags') return 'tags';
    if (location.pathname === '/admin/users') return 'users';
    if (location.pathname === '/admin/media') return 'media';
    if (location.pathname === '/admin/settings') return 'settings';
    return 'dashboard';
  };

  // Handle tab changes
  const handleTabChange = (value: string) => {
    switch (value) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'articles':
        navigate('/admin/articles');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'media':
        navigate('/admin/media');
        break;
      case 'categories':
        navigate('/admin/categories');
        break;
      case 'tags':
        navigate('/admin/tags');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
    }
  };

  // Render article form for new/edit article routes
  if (location.pathname === '/admin/new-article') {
    return (
      <AdminLayout>
        <ArticleForm />
      </AdminLayout>
    );
  }

  if (articleId) {
    return (
      <AdminLayout>
        <ArticleForm articleId={articleId} />
      </AdminLayout>
    );
  }

  // If we're on the /admin/articles route, render the ArticlesManagement component directly
  if (location.pathname === '/admin/articles') {
    return (
      <AdminLayout>
        <ArticlesManagement />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {!isMobile && (
            <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
          )}
          <AdminHeaderActions />
        </div>

        <Tabs defaultValue={getActiveTab()} onValueChange={handleTabChange} className="w-full">
          <AdminNavigationTabs />

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

            <TabsContent value="tags">
              <TagManagement />
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