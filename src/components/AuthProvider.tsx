import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({ session: null, isAdmin: false });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user.id);
      setSession(session);
      checkAdminStatus(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session?.user.id);
      setSession(session);
      checkAdminStatus(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (session: Session | null) => {
    if (!session) {
      console.log("No session, setting isAdmin to false");
      setIsAdmin(false);
      return;
    }

    try {
      console.log("Checking admin status for user:", session.user.id);
      
      // First check if the profile exists
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id);

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      // Check if we got any profiles back
      if (!profiles || profiles.length === 0) {
        console.log("No profile found for user");
        setIsAdmin(false);
        return;
      }

      const profile = profiles[0];
      console.log("Profile data:", profile);
      const isUserAdmin = profile.role === 'admin';
      console.log("Is user admin?", isUserAdmin);
      setIsAdmin(isUserAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};