import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { SignIn } from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { AdminArticleForm } from "@/pages/AdminArticleForm";
import { ArticlePage } from "@/pages/ArticlePage";
import { CategoryPage } from "@/pages/CategoryPage";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/articles" element={<AdminDashboard />} />
        <Route path="/admin/new-article" element={<AdminArticleForm />} />
        <Route path="/admin/edit-article/:id" element={<AdminArticleForm />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;