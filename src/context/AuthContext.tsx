"use client";
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import Cookies from 'js-cookie';
import { getMe } from '@/services/user';

interface User {
  token: string;
  firstname: string;
  lastname: string;
  country: string;
  city: string;
  email: string;
  walletAddress: string;
}

interface AuthContextType {
  user: { token: string, username: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ token: string, username: string } | null>>;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ token: string, username: string } | null>(null);

  const fetchUser = useCallback(async (token: string) => {
    try {
      const me = await getMe(token);
      console.log('User data from /auth/me:', me);
      setUser({ token, ...me });
      // Guardar en localStorage para persistencia
      localStorage.setItem('user', JSON.stringify(me));
    } catch (error) {
      console.error('Error fetching user data:', error);
      // En caso de error, limpiar tokens
      Cookies.remove('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  // Verificar si hay un token guardado al inicializar
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      // Intentar obtener datos frescos del servidor
      fetchUser(token);
    }
  }, [fetchUser]);

  const login = useCallback(async (token: string) => {
    try {
      // Establecer el token en las cookies
      Cookies.set('token', token, {
        expires: 1, // 1 día
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      
      // Obtener datos del usuario desde /auth/me
      await fetchUser(token);
    } catch (error) {
      console.error('Error during login:', error);
      // En caso de error, limpiar el token
      Cookies.remove('token');
      localStorage.removeItem('user');
      setUser(null);
      throw error;
    }
  }, [fetchUser]);

  const logout = useCallback(() => {
    Cookies.remove('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = Cookies.get('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser({ token, ...userData });
      } catch (error) {
        console.error('Error refreshing user:', error);
        logout();
      }
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};