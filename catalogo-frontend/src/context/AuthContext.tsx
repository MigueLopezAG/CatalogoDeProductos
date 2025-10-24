'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginData, RegisterData } from '@/types';
import { authService } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Decodificar el token JWT para obtener información del usuario
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({
            id: payload.id,
            email: payload.email,
            role: payload.role,
          });
        }
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginData) => {
    const response = await authService.login(data);
    localStorage.setItem('token', response.token);
    
    const payload = JSON.parse(atob(response.token.split('.')[1]));
    setUser({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });
  };

  const register = async (data: RegisterData) => {
    const response = await authService.register(data);
    localStorage.setItem('token', response.token);
    
    const payload = JSON.parse(atob(response.token.split('.')[1]));
    setUser({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};