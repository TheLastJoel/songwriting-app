'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  userId: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ userId: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const signInAnonymously = async () => {
      const { data: { user } } = await supabase.auth.signInAnonymously();
      setUserId(user?.id || null);
      setLoading(false);
    };
    signInAnonymously();
  }, []);

  return <AuthContext.Provider value={{ userId, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);