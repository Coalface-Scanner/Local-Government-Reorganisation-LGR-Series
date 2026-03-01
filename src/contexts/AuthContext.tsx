import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { hasValidSupabase } from '../lib/supabaseEnv';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const authRef = useRef<{
    getSession: () => Promise<{ data: { session: Session | null } }>;
    signInWithPassword: (opts: { email: string; password: string }) => Promise<{ error: Error | null }>;
    signOut: () => Promise<{ error: AuthError | null }>;
    onAuthStateChange: (cb: (_e: string, s: Session | null) => void) => { data: { subscription: { unsubscribe: () => void } } };
  } | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!hasValidSupabase) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    import('../lib/supabase').then(({ supabase }) => {
      if (cancelled) return;
      authRef.current = supabase.auth;
      supabase.auth.getSession().then(({ data: { session: s } }) => {
        if (cancelled) return;
        setSession(s);
        setUser(s?.user ?? null);
        setLoading(false);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
        if (cancelled) return;
        setSession(s);
        setUser(s?.user ?? null);
        setLoading(false);
      });
      unsubRef.current = () => subscription.unsubscribe();
      if (cancelled) subscription.unsubscribe();
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
      unsubRef.current?.();
      unsubRef.current = null;
      authRef.current = null;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const auth = authRef.current;
    if (!auth) return { error: new Error('Auth not ready') as Error };
    try {
      const { error } = await auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    const auth = authRef.current;
    if (auth) return await auth.signOut();
    return { error: null };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
