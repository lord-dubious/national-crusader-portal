import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import ArticlePage from "./pages/ArticlePage";
import TagPage from "./pages/TagPage";
import AdminDashboard from "./pages/AdminDashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { useState } from "react";

function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/tag/:slug" element={<TagPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/new-article" element={<AdminDashboard />} />
            <Route path="/admin/edit-article/:id" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;