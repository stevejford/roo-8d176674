import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const updateLastSignIn = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ last_sign_in_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        console.error('Error updating last sign in:', error);
      }
    } catch (error) {
      console.error('Error in updateLastSignIn:', error);
    }
  };

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
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        toast.error("Error checking admin status");
        setIsAdmin(false);
        return;
      }

      console.log("Profile data:", profile);
      if (profile) {
        const isUserAdmin = profile.role === 'admin';
        console.log("Is user admin?", isUserAdmin);
        setIsAdmin(isUserAdmin);
      } else {
        console.log("No profile found");
        setIsAdmin(false);
      }

    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      toast.error("Error checking admin status");
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
      setIsCheckingAdmin(false);
    }
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user.id);
      setSession(session);
      if (session) {
        updateLastSignIn(session.user.id);
      }
      checkAdminStatus(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session?.user.id);
      setSession(session);
      if (session) {
        updateLastSignIn(session.user.id);
      }
      checkAdminStatus(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};