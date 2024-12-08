import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  isAdmin: false,
  isLoading: true 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const navigate = useNavigate();

  const checkAdminStatus = async (session: Session | null) => {
    if (!session || isCheckingAdmin) {
      console.log("No session or already checking admin status");
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsCheckingAdmin(true);
      console.log("Checking admin status for user:", session.user.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      const isUserAdmin = profile?.role === 'admin';
      console.log("User admin status:", isUserAdmin);
      setIsAdmin(isUserAdmin);

    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
      setIsCheckingAdmin(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user.id);
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to login");
        setSession(null);
        setIsAdmin(false);
        navigate('/login');
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log("User signed in or token refreshed");
        setSession(currentSession);
        await checkAdminStatus(currentSession);
      }
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession?.user.id);
      setSession(initialSession);
      checkAdminStatus(initialSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ session, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};