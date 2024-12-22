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
    enabled: !!session?.user?.id,
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

  if (isLoadingSession || isLoadingProfile) {
    return null;
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
        <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
          {isMobile && (
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
          )}
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};