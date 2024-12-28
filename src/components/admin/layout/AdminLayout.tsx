import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const getBreadcrumbTitle = (path: string) => {
  switch (path) {
    case '/admin':
      return 'Dashboard';
    case '/admin/articles':
      return 'Articles';
    case '/admin/categories':
      return 'Categories';
    case '/admin/tags':
      return 'Tags';
    case '/admin/media':
      return 'Media';
    case '/admin/users':
      return 'Users';
    default:
      if (path.startsWith('/admin/edit-article/')) {
        return 'Edit Article';
      }
      if (path === '/admin/new-article') {
        return 'New Article';
      }
      return '';
  }
};

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        console.log("Fetching session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          // If there's a refresh token error, sign out the user
          if (error.message.includes("refresh_token_not_found")) {
            await supabase.auth.signOut();
            throw new Error("Session expired. Please sign in again.");
          }
          throw error;
        }
        
        if (!session) {
          throw new Error("No active session");
        }
        
        console.log("Session data:", session);
        return session;
      } catch (error: any) {
        console.error("Session error:", error);
        throw error;
      }
    },
    retry: false, // Don't retry on auth errors
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "Please sign in to continue"
      });
      navigate('/signin');
    }
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["admin-profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      try {
        console.log("Fetching profile for user:", session.user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Profile error:", error);
          throw error;
        }
        
        console.log("Profile data:", profile);
        return profile;
      } catch (error: any) {
        console.error("Failed to fetch profile:", error);
        throw error;
      }
    },
    enabled: !!session?.user?.id,
    retry: 1,
  });

  useEffect(() => {
    if (!isLoadingSession && !session) {
      console.log("No session found, redirecting to signin");
      navigate('/signin');
      return;
    }

    if (!isLoadingProfile && !isLoadingSession && profile && profile.role !== 'admin') {
      console.log("User is not admin, redirecting to home");
      navigate('/');
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You must be an admin to access this page."
      });
    }
  }, [session, profile, isLoadingSession, isLoadingProfile, navigate, toast]);

  if (isLoadingSession || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="space-y-4 w-full max-w-md p-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!profile || !session) {
    return null;
  }

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((_, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    return {
      title: getBreadcrumbTitle(path),
      path,
    };
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-primary text-primary-foreground">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden transition-all duration-200">
          <Breadcrumb className="mb-4">
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={crumb.path}>
                <BreadcrumbLink 
                  href={crumb.path}
                  className="text-[#8E9196] hover:text-white transition-colors"
                >
                  {crumb.title}
                </BreadcrumbLink>
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-[#8E9196]" />
                )}
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};