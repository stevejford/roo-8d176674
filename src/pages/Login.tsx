import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { session, isAdmin, isLoading } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  useEffect(() => {
    if (session && !isLoading) {
      console.log("Login redirect check - IsAdmin:", isAdmin);
      if (isAdmin) {
        console.log("Redirecting admin to admin dashboard");
        navigate("/admin");
      } else {
        console.log("Redirecting user to main page");
        navigate("/");
      }
    }
  }, [session, isAdmin, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Please sign in to continue</p>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#10B981',
                    brandAccent: '#059669',
                  }
                }
              }
            }}
            providers={[]}
          />
        </div>
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {session ? (
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2 text-sm"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
                {isAdmin && <span>Admin Logout</span>}
              </button>
            ) : (
              <div className="text-gray-400 text-sm">
                <span>Admin Login</span>
              </div>
            )}
          </div>
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Roo Restaurant. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;