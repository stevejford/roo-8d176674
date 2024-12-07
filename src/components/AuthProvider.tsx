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
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);

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

      // If no profile exists, create one
      if (!profile) {
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
          return;
        }

        console.log("Created new profile:", newProfile);
        setIsAdmin(newProfile.role === 'admin');
      } else {
        console.log("Found existing profile:", profile);
        setIsAdmin(profile.role === 'admin');
      }
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
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
      checkAdminStatus(session);
    });

    // Listen for auth changes
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