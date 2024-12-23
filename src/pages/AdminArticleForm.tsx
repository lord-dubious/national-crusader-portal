import { ArticleForm } from "@/components/admin/ArticleForm";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { useParams } from "react-router-dom";

export const AdminArticleForm = () => {
  const { articleId } = useParams();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">
          {articleId ? "Edit Article" : "Create New Article"}
        </h1>
        <ArticleForm articleId={articleId} />
      </div>
    </AdminLayout>
  );
};

export default AdminArticleForm;