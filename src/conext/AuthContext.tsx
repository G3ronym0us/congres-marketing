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
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async (token: string) => {
    try {
      const me = await getMe(token);
      setUser({ token, ...me });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchUser(token);
    }
  }, [fetchUser]);

  const login = useCallback(async (token: string) => {
    Cookies.set('token', token);
    await fetchUser(token);
  }, [fetchUser]);

  const logout = useCallback(() => {
    Cookies.remove('token');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = Cookies.get('token');
    if (token) {
      await fetchUser(token);
    }
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};