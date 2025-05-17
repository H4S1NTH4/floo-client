"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth-service';

export type UserRole = 'customer' | 'restaurant' | 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('No authenticated user found');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      
      // Redirect based on user role
      if (loggedInUser.role === 'customer') {
        router.push('/customer/home');
      } else if (loggedInUser.role === 'restaurant') {
        router.push('/restaurant/dashboard');
      } else if (loggedInUser.role === 'driver') {
        router.push('/driver/home');
      } else if (loggedInUser.role === 'admin') {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      const newUser = await authService.signup(name, email, password, role);
      setUser(newUser);
      
      // Redirect based on user role
      if (newUser.role === 'customer') {
        router.push('/customer/home');
      } else if (newUser.role === 'restaurant') {
        router.push('/restaurant/dashboard');
      } else if (newUser.role === 'driver') {
        router.push('/driver/home');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const loggedInUser = await authService.loginWithGoogle();
      setUser(loggedInUser);
      
      // Redirect based on user role
      if (loggedInUser.role === 'customer') {
        router.push('/customer/home');
      } else if (loggedInUser.role === 'restaurant') {
        router.push('/restaurant/dashboard');
      } else if (loggedInUser.role === 'driver') {
        router.push('/driver/available');
      } else if (loggedInUser.role === 'admin') {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    setLoading(true);
    try {
      const loggedInUser = await authService.loginWithFacebook();
      setUser(loggedInUser);
      
      // Redirect based on user role
      if (loggedInUser.role === 'customer') {
        router.push('/customer/home');
      } else if (loggedInUser.role === 'restaurant') {
        router.push('/restaurant/dashboard');
      } else if (loggedInUser.role === 'driver') {
        router.push('/driver/available');
      } else if (loggedInUser.role === 'admin') {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Facebook login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout, 
      loginWithGoogle, 
      loginWithFacebook 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};