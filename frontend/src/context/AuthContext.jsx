import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || 'session-admin-bekasi');
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('adminInfo');
      return stored ? JSON.parse(stored) : { username: 'admin' };
    } catch {
      return { username: 'admin' };
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

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAuthenticated }}>
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
