import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

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

  const checkAdminStatus = async (session: Session | null) => {
    if (!session) {
      console.log("No session, setting isAdmin to false");
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Checking admin status for user:", session.user.id);
      
      // First try to get the profile
      let { data: profiles, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id);

      // If no profile exists, create one
      if (!profiles || profiles.length === 0) {
        console.log("No profile found, creating one...");
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            { id: session.user.id, role: 'user' }
          ])
          .select('role')
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        profiles = [newProfile];
      }

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      const profile = profiles[0];
      console.log("Profile data:", profile);
      const isUserAdmin = profile.role === 'admin';
      console.log("Is user admin?", isUserAdmin);
      setIsAdmin(isUserAdmin);
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setIsLoading(false);
    }
  };

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

  return (
    <AuthContext.Provider value={{ session, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};