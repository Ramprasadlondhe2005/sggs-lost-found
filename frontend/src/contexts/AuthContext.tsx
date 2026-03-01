import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success && data.user) {
        // Map backend user to frontend User type if necessary. Backend returns `_id`
        setUser({
          ...data.user,
          id: data.user._id,
        });
      }
    } catch (err) {
      console.error('Failed to fetch user', err);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchUser();
    } else {
      setIsLoading(false);
    }

    const authErrorListener = () => {
      setUser(null);
      localStorage.removeItem('token');
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('auth-unauthorized', authErrorListener);
    return () => window.removeEventListener('auth-unauthorized', authErrorListener);
  }, []);

  const login = async (email: string, password: string, role?: UserRole): Promise<boolean> => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser({ ...data.user, id: data.user._id });

        // Ensure role matches, otherwise we might warn or abort. 
        // For now, if role is passed, we can double check, but mostly we accept it since backend handles it or it's a specific portal.
        if (role && data.user.role !== role) {
          toast.warning(`Logged in as ${data.user.role}, redirecting appropriately...`);
        }
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Login failed', err);
      throw new Error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const { data } = await api.post('/auth/register', userData);
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser({ ...data.user, id: data.user._id });
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Registration failed', err);
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        throw new Error(err.response.data.errors[0].msg || err.response.data.errors[0].message);
      }
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed gracefully', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isLoading }}>
      {isLoading ? <div className="h-screen w-full flex items-center justify-center">Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
