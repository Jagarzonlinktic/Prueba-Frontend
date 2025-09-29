"use client";

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const res = await fetch('/api/users/me', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // --- CAMBIO IMPORTANTE AQUÍ ---
    // Creamos una cookie simple que el middleware pueda leer.
    // Esto le dice al servidor que hemos iniciado sesión.
    document.cookie = `accessToken=true; path=/; max-age=86400;`; // max-age=1 día

    fetch('/api/users/me', { headers: { 'Authorization': `Bearer ${accessToken}` } })
      .then(res => res.json())
      .then(userData => {
        setUser(userData);
        router.push('/dashboard');
      });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    // Limpiamos la cookie para que el middleware sepa que cerramos sesión.
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    router.push('/login');
  };
  
  const isAuthenticated = !!user;

  const contextValue = { 
    isAuthenticated, 
    user, 
    login, 
    logout, 
    isLoading 
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

