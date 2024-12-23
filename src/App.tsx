import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import AdminDashboard from "@/pages/AdminDashboard";
import { AdminArticleForm } from "@/pages/AdminArticleForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
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
    element: <AdminDashboard />,
  },
  {
    path: "/admin/new-article",
    element: <AdminArticleForm />,
  },
  {
    path: "/admin/edit-article/:articleId",
    element: <AdminArticleForm />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;