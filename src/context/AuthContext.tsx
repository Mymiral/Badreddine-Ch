import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  role?: 'user' | 'agent' | 'admin';
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        localStorage.setItem('hasVisitedWelcome', 'true');
        fetchProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        localStorage.setItem('hasVisitedWelcome', 'true');
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Query our public.users table to get custom metadata like role and phone
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.warn('Error fetching user profile from public.users table:', error);
      }

      setUser({
        uid: supabaseUser.id,
        email: supabaseUser.email || null,
        displayName: data?.display_name || supabaseUser.user_metadata?.displayName || supabaseUser.user_metadata?.name || null,
        phoneNumber: data?.phone_number || supabaseUser.phone || null,
        photoURL: data?.photo_url || supabaseUser.user_metadata?.avatar_url || null,
        role: (data?.role as 'user' | 'agent' | 'admin') || 'user',
      });
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setUser({
        uid: supabaseUser.id,
        email: supabaseUser.email || null,
        displayName: supabaseUser.user_metadata?.displayName || supabaseUser.user_metadata?.name || null,
        phoneNumber: supabaseUser.phone || null,
        photoURL: supabaseUser.user_metadata?.avatar_url || null,
        role: 'user',
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('hasVisitedWelcome');
      window.location.href = '/welcome';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
