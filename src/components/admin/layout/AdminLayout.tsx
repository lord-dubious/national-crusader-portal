import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'admin@nationalcrusader.com') {
        navigate('/');
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You must be an admin to access this page."
        });
      }
    };
    checkAdmin();
  }, [navigate, toast]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-primary text-primary-foreground">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};