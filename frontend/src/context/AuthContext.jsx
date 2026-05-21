import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.access_token);
    setUser(res.data.user);
  };

  const loginSocial = async (provider) => {
    const res = await api.post('/auth/social-mock', { provider });
    localStorage.setItem('token', res.data.access_token);
    setUser(res.data.user);
  };

  const register = async (username, email, password, role = 'developer') => {
    await api.post('/auth/register', { username, email, password, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginSocial, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
