import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isopen, setIsOpen] = useState(false)


  // Check authentication on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await axios.get('/api/v1/auth', {
          withCredentials: true,
        });
        if (res.data.success && res.data.authenticated) {
          setIsAuthenticated(true);
          setUser(res.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error(
          'Authentication verification failed:',
          error.response?.data?.message || error.message
        );
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Login function: Sends credentials, expects cookie
  const login = async (email, password) => {
    try {
      await axios.post(
        '/api/v1/signin',
        { email, password },
        {
          withCredentials: true,
        }
      );
      const res = await axios.get('/api/v1/auth', {
        withCredentials: true,
      });
      if (res.data.success && res.data.authenticated) {
        setIsAuthenticated(true);
        setUser(res.data.user);
      } else {
        throw new Error('Authentication failed after signin');
      }
    } catch (error) {
      console.error('Signin failed:', error.response?.data?.message || error.message);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(
        '/api/v1/logout',
        {},
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.message || error.message);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout,isopen,setIsOpen}}>
      {children}
    </AuthContext.Provider>
  );
};
