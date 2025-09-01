import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8080';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isopen, setIsOpen] = useState(false);

  // Cookie से user data fetch करने का function
  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/me', {
        withCredentials: true,
      });

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log('User fetched:', response.data.user);
        // console.log(user);

      } else {
        // Handle case where API returns success but no user
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('Fetch user error:', error.response?.data?.message || error.message);

      // Only log out if it's an authentication error, not network error
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null);
        setIsAuthenticated(false);
      }
      // For network errors, maintain current state
    } finally {
      setLoading(false);
    }
  }, []);
  console.log(user);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);

      // Validate input
      if (!email || !password) {
        return {
          success: false,
          message: 'Email and password are required',
        };
      }

      const response = await axios.post(
        '/api/v1/signin',
        { email: email.trim(), password },
        { withCredentials: true }
      );

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log('Login successful:', response.data.user);
        return {
          success: true,
          user: response.data.user,
        };
      } else {
        // Handle unexpected response structure
        setUser(null);
        setIsAuthenticated(false);
        return {
          success: false,
          message: 'Unexpected response from server',
        };
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      setUser(null);
      setIsAuthenticated(false);

      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);

      await axios.post(
        '/api/v1/logout',
        {},
        {
          withCredentials: true,
        }
      );

      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.message || error.message);
      // Continue with logout even if API call fails
    } finally {
      // Always reset auth state regardless of API call success
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);

      // Optional: Redirect to login page
      // window.location.href = '/login';
    }
  };

  // Refresh user data function
  const refreshUser = useCallback(async () => {
    if (isAuthenticated) {
      await fetchUser();
    }
  }, [fetchUser, isAuthenticated]);

  // Component load होने पर cookie से user data fetch करो
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Auto-refresh user data periodically (optional)
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        refreshUser();
      }, 30 * 60 * 1000); // Refresh every 30 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshUser]);

  const contextValue = {
    // State
    isAuthenticated,
    user,
    loading,
    isopen,

    // Actions
    login,
    logout,
    fetchUser,
    refreshUser,
    setIsOpen,

    // Helper functions
    isLoggedIn: () => isAuthenticated && !!user,
    getUserId: () => user?._id,
    getUserEmail: () => user?.email,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
