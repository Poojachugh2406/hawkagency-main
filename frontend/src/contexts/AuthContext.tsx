import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiPost } from '../utils/api';
import type { LoginData, RegisterData, User } from '../types/auth';
import type { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginData) => {
    try {
      const response = await apiPost<{ token: string; user: User }>('/auth/login', credentials);

      if (response.success && response.data) {
        const { token: newToken, user: userData } = response.data;
        setToken(newToken);
        setUser({...userData , role:(credentials.role as 'admin' | 'mediator' | 'user' | 'seller')});
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify({...userData , role:(credentials.role as 'admin' | 'mediator' | 'user' | 'seller')}));

      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      // Re-throw the error so Login.tsx can handle it
      throw error;
    }
  };


const register = async (userData: RegisterData): Promise<void> => {
  try {
    const response = await apiPost<{ 
      success: boolean;
      message: string;
      data: {
        id: string;
        name: string;
        email: string;
        role: string;
        phone: string;
      }
    }>('/auth/register', userData);
    
    if (response.success) {
      // Registration successful, but don't log in automatically
      // The user needs to login with their credentials
      return;
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Registration failed');
  }
};
  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optionally, navigate to login page or home
  };
  const updateUser = (userData: User) => {
  setUser(userData);
  localStorage.setItem('user', JSON.stringify(userData));
};


  const value: AuthContextType = {
    user,
    token,
    updateUser,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};