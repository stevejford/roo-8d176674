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
      setSession(session);
      checkAdminStatus(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkAdminStatus(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (session: Session | null) => {
    if (!session) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id);

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      // Check if we have any profiles and if the first one has role 'admin'
      setIsAdmin(profiles && profiles.length > 0 && profiles[0].role === 'admin');
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