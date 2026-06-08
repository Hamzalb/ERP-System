'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api, { setAccessToken, apiPost } from '@/lib/api';

interface UserProfile {
  id?: string;   // from login endpoint
  _id?: string;  // from /users/me endpoint
  name: string;
  email: string;
  roles?: { name: string }[];
  avatar?: string;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true, isAuthenticated: false });

  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get<{ data: UserProfile }>('/users/me');
      setState({ user: res.data.data, isLoading: false, isAuthenticated: true });
    } catch {
      setState({ user: null, isLoading: false, isAuthenticated: false });
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    // Try to restore session from httpOnly refresh token cookie
    api.post('/auth/refresh')
      .then((res) => {
        const token = (res.data as any)?.data?.accessToken;
        if (token) {
          setAccessToken(token);
          fetchMe();
        } else {
          setState({ user: null, isLoading: false, isAuthenticated: false });
        }
      })
      .catch(() => {
        // No valid session — show login, never block the UI
        setState({ user: null, isLoading: false, isAuthenticated: false });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiPost<{ accessToken: string; user: UserProfile }>('/auth/login', { email, password });
    setAccessToken(res.data.accessToken);
    setState({ user: res.data.user, isLoading: false, isAuthenticated: true });
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    setAccessToken(null);
    setState({ user: null, isLoading: false, isAuthenticated: false });
    router.push('/login');
  }, [router]);

  const refreshUser = useCallback(() => fetchMe(), [fetchMe]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
