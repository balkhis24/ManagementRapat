import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || null);
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('adminInfo');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (newToken, adminInfo) => {
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
    setToken(newToken);
    setAdmin(adminInfo);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    setToken(null);
    setAdmin(null);
  };

  const isAuthenticated = !!token;
  const isNotulis = admin?.role === 'NOTULIS';
  const isAdmin = admin?.role === 'ADMIN' || (!admin?.role && isAuthenticated);

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAuthenticated, isNotulis, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};

export default AuthContext;
