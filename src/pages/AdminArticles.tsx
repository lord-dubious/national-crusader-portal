import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { ArticlesManagement } from "@/components/admin/ArticlesManagement";

export const AdminArticles = () => {
  return (
    <AdminLayout>
      <ArticlesManagement />
    </AdminLayout>
  );
};

export default AdminArticles;