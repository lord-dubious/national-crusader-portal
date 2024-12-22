import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { useQuery } from "@tanstack/react-query";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["admin-profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (error) throw error;
      return profile;
    },
    enabled: !!session?.user?.id, // Only run this query when we have a session
  });

  useEffect(() => {
    if (!isLoadingSession && !session) {
      navigate('/signin');
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Please sign in to access the admin panel."
      });
      return;
    }

    if (!isLoadingProfile && !isLoadingSession && profile && profile.role !== 'admin') {
      navigate('/');
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You must be an admin to access this page."
      });
    }
  }, [session, profile, isLoadingSession, isLoadingProfile, navigate, toast]);

  // Show loading state while checking authentication and profile
  if (isLoadingSession || isLoadingProfile) {
    return null;
  }

  // Don't render anything if not authenticated or not an admin
  if (!profile || !session) {
    return null;
  }

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