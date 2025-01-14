import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
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

export const AdminLayout = () => {
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
        if (error) throw error;
        console.log("Session data:", session);
        return session;
      } catch (error: any) {
        console.error("Session error:", error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000,
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
    retry: 2,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (!isLoadingSession && !session) {
      console.log("No session found, redirecting to signin");
      navigate('/signin');
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Please sign in to access the admin panel."
      });
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
      <div className="min-h-screen flex items-center justify-center bg-[#222222]">
        <div className="space-y-4 w-full max-w-md p-4">
          <Skeleton className="h-8 w-3/4 bg-[#333333]" />
          <Skeleton className="h-4 w-full bg-[#333333]" />
          <Skeleton className="h-4 w-2/3 bg-[#333333]" />
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

  const handleBreadcrumbClick = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#222222] text-white">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden transition-all duration-200">
          <div className="mb-6 overflow-x-auto">
            <Breadcrumb className="flex items-center min-h-[40px]">
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={crumb.path} className="flex items-center whitespace-nowrap">
                  <button
                    onClick={() => handleBreadcrumbClick(crumb.path)}
                    className="text-[#8E9196] hover:text-white transition-colors flex items-center px-2 py-1 rounded-md hover:bg-[#333333]"
                  >
                    {crumb.title}
                  </button>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-[#8E9196] mx-2 flex-shrink-0" />
                  )}
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          </div>
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};