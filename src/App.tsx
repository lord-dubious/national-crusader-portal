import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Articles } from "@/pages/Articles";
import { Categories } from "@/pages/Categories";
import { Tags } from "@/pages/Tags";
import { Users } from "@/pages/Users";
import { NewArticle } from "@/pages/NewArticle";
import { EditArticle } from "@/pages/EditArticle";
import { AdminMedia } from "@/pages/AdminMedia";
import { SignIn } from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";
import { Home } from "@/pages/Home";
import { Article } from "@/pages/Article";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/article/:slug",
    element: <Article />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/admin",
    element: (
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/articles",
    element: (
      <AdminLayout>
        <Articles />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/new-article",
    element: (
      <AdminLayout>
        <NewArticle />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/edit-article/:id",
    element: (
      <AdminLayout>
        <EditArticle />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/categories",
    element: (
      <AdminLayout>
        <Categories />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/tags",
    element: (
      <AdminLayout>
        <Tags />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/media",
    element: (
      <AdminLayout>
        <AdminMedia />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminLayout>
        <Users />
      </AdminLayout>
    ),
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}