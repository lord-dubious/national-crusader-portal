import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { RecentArticles } from "@/components/admin/dashboard/RecentArticles";
import { UserManagement } from "@/components/admin/UserManagement";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { TagManagement } from "@/components/admin/TagManagement";
import { SiteSettings } from "@/components/admin/SiteSettings";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminHeaderActions } from "@/components/admin/dashboard/AdminHeaderActions";

export const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Extract article ID from URL if editing
  const articleId = location.pathname.match(/\/admin\/edit-article\/(\d+)/)?.[1];

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

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {!isMobile && (
            <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
          )}
          <AdminHeaderActions />
        </div>

        <div className="space-y-4 md:space-y-8">
          <DashboardStats />
          <RecentArticles />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;