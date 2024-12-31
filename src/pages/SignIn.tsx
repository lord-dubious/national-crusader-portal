import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate('/');
      }
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }
      if (event === 'USER_UPDATED') {
        console.log('User updated:', session);
      }
    });

    // Listen for auth errors
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
      authListener.data.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border border-border">
        <h1 className="text-2xl font-bold text-center mb-8">Welcome to National Crusader</h1>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#ea384c',
                  brandAccent: '#ea384c',
                  brandButtonText: 'white',
                  defaultButtonBackground: '#ea384c',
                  defaultButtonBackgroundHover: '#d1293c',
                },
              },
            },
            style: {
              button: { 
                background: '#ea384c', 
                color: 'white',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
              },
              anchor: { color: '#ea384c' },
              message: { color: '#ea384c' },
              container: { color: 'inherit' },
              label: { color: 'inherit' },
              input: { 
                backgroundColor: 'transparent',
                borderColor: 'hsl(var(--border))',
                color: 'inherit',
              },
            },
          }}
          providers={[]}
          view="sign_in"
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: "Don't have an account? Sign up",
              },
            },
          }}
          onError={(error) => {
            console.error('Auth error:', error);
            setError(error.message);
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: error.message,
            });
          }}
        />
      </div>
    </div>
  );
};

export default SignIn;