import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserResponse } from '../types';
import { authService } from '../api/authService';

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Даем время для инициализации interceptor'ов
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error: any) {
          console.error('Failed to get current user:', error);
          // Если ошибка 401, interceptor попытается обновить токен
          if (error?.response?.status === 401) {
            // Ждем обновления токена и повторяем попытку
            await new Promise(resolve => setTimeout(resolve, 500));
            try {
              const currentUser = await authService.getCurrentUser();
              setUser(currentUser);
            } catch (retryError) {
              // Если после обновления все еще ошибка, очищаем
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Слушаем изменения в localStorage для синхронизации между вкладками
  useEffect(() => {
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === 'accessToken' && e.newValue && !user) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to sync user:', error);
        }
      } else if (e.key === 'accessToken' && !e.newValue && user) {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    setUser(response.user);
  };

  const register = async (username: string, password: string) => {
    const response = await authService.register({ username, password });
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

