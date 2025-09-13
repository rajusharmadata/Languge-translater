import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8080';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with true for initial load
  const [isopen, setIsOpen] = useState(true);
  const [error, setError] = useState(null); // Add error state

  // Track if we've already tried to fetch user on initial load
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);

  // Use refs to prevent unnecessary API calls
  const lastFetchTime = useRef(0);
  const fetchUserRef = useRef(null);

  // Cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Clear error helper function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Optimized fetchUser with better error handling
  const fetchUser = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();

      // If we have recent data and not forcing refresh, skip API call
      if (
        !forceRefresh &&
        user &&
        isAuthenticated &&
        now - lastFetchTime.current < CACHE_DURATION
      ) {
        console.log('Using cached user data');
        return { success: true, user };
      }

      // Prevent multiple concurrent requests
      if (fetchUserRef.current) {
        console.log('Fetch already in progress');
        return fetchUserRef.current;
      }

      try {
        setLoading(!initialFetchComplete); // Only show loading on initial fetch
        setError(null); // Clear any previous errors

        fetchUserRef.current = axios.get('/api/v1/me', {
          withCredentials: true,
        });

        const response = await fetchUserRef.current;

        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          lastFetchTime.current = now;
          console.log('User fetched successfully');

          return {
            success: true,
            user: response.data.user,
            message: 'User data fetched successfully',
          };
        } else {
          // Clear auth state if API returns success but no user
          setUser(null);
          setIsAuthenticated(false);
          lastFetchTime.current = 0;

          const message = response.data.message || 'No user data found';
          setError(message);

          return {
            success: false,
            message,
          };
        }
      } catch (error) {
        console.log(
          'Fetch user error:',
          error.response?.data?.message || error.message
        );

        let errorMessage = 'Failed to fetch user data';
        let shouldClearAuth = false;

        if (error.response) {
          // Server responded with error
          errorMessage =
            error.response.data?.message || 'Server error occurred';

          // Only clear auth on 401/403 errors
          if (error.response.status === 401 || error.response.status === 403) {
            shouldClearAuth = true;
            errorMessage = 'Session expired. Please login again.';
          }
        } else if (error.request) {
          // Network error
          errorMessage = 'Network error. Please check your connection.';
          // Don't clear auth on network errors - user might be temporarily offline
        } else {
          // Other errors
          errorMessage = error.message || 'Unexpected error occurred';
        }

        if (shouldClearAuth) {
          setUser(null);
          setIsAuthenticated(false);
          lastFetchTime.current = 0;
        }

        setError(errorMessage);

        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setLoading(false);
        setInitialFetchComplete(true);
        fetchUserRef.current = null;
      }
    },
    [user, isAuthenticated, initialFetchComplete]
  );

  // Optimized login function with better error handling
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      // Validate input
      if (!email || !password) {
        const message = 'Email and password are required';
        setError(message);
        return {
          success: false,
          message,
        };
      }

      console.log('Attempting login...');

      const response = await axios.post(
        '/api/v1/signin',
        { email: email.trim(), password: password },
        { withCredentials: true }
      );

      console.log('Login response:', response.data);
      console.log(response.data.success);
      console.log(response.data.data);
      if (response.data.success && response.data.data) {
        setUser(response.data.data);

        setIsAuthenticated(true);
        lastFetchTime.current = Date.now();
        setError(null); // Clear any errors
        console.log('Login successful');

        return {
          success: true,
          user: response.data.data,
          message: response.data.message || 'Login successful',
        };
      } else {
        // Handle case where server returns success: false
        setUser(null);
        setIsAuthenticated(false);
        lastFetchTime.current = 0;

        const errmessage = response.data.message;
        setError(errmessage);

        return {
          success: false,
          errmessage,
        };
      }
    } catch (error) {
      console.error('Login error:', error);

      setUser(null);
      setIsAuthenticated(false);
      lastFetchTime.current = 0;

      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || 'Invalid credentials';
        console.log('Server error:', error.response.data);
      } else if (error.request) {
        // Network error
        errorMessage =
          'Network error. Please check your connection and try again.';
        console.log('Network error');
      } else {
        // Other errors
        errorMessage = error.message || 'Unexpected error occurred';
        console.log('Other error:', error.message);
      }

      setError(errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);
  console.log(user);

  // Optimized logout function with better error handling
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Make logout API call
      const response = await axios.post(
        '/api/v1/logout',
        {},
        { withCredentials: true }
      );

      console.log('Logout successful');

      return {
        success: true,
        message: response.data?.message || 'Logout successful',
      };
    } catch (error) {
      console.error(
        'Logout failed:',
        error.response?.data?.message || error.message
      );

      const errorMessage = error.response?.data?.message || 'Logout failed';
      setError(errorMessage);

      // Continue with logout even if API call fails
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      // Always reset auth state
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      lastFetchTime.current = 0;
    }
  }, []);

  // Smart refresh function
  const refreshUser = useCallback(async () => {
    if (isAuthenticated) {
      return await fetchUser(true); // Force refresh and return result
    }
    return { success: false, message: 'User not authenticated' };
  }, [fetchUser, isAuthenticated]);

  // Retry function for failed operations
  const retry = useCallback(async (operation) => {
    setError(null);
    return await operation();
  }, []);

  // Initial user fetch on app load
  useEffect(() => {
    if (!initialFetchComplete) {
      fetchUser();
    }
  }, [fetchUser, initialFetchComplete]);

  // Auto-refresh with smarter intervals and error recovery
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let interval;

    // Check if user is active (has interacted recently)
    const checkUserActivity = async () => {
      const lastActivity = parseInt(
        localStorage.getItem('lastActivity') || '0'
      );
      const now = Date.now();

      // If user was active in last 10 minutes, refresh data
      if (now - lastActivity < 10 * 60 * 1000) {
        const result = await refreshUser();
        if (!result.success) {
          console.log('Auto-refresh failed:', result.message);
        }
      }
    };

    // Set up periodic refresh only if user is active
    interval = setInterval(checkUserActivity, 15 * 60 * 1000); // Check every 15 minutes

    // Track user activity
    const trackActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // Listen for user interactions
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];
    events.forEach((event) => {
      document.addEventListener(event, trackActivity, { passive: true });
    });

    // Initial activity tracking
    trackActivity();

    return () => {
      if (interval) clearInterval(interval);

      // Remove event listeners
      events.forEach((event) => {
        document.removeEventListener(event, trackActivity);
      });
    };
  }, [isAuthenticated, user, refreshUser]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      // State
      isAuthenticated,
      user,
      loading,
      isopen,
      error,

      // Actions
      login,
      logout,
      fetchUser: () => fetchUser(true), // Always force refresh when called manually
      refreshUser,
      setIsOpen,
      clearError,
      retry,

      // Helper functions
      isLoggedIn: () => isAuthenticated && !!user,
      getUserId: () => user?._id,
      getUserEmail: () => user?.email,
      getUserRole: () => user?.role,
      isInitialLoadComplete: () => initialFetchComplete,
      hasError: () => !!error,
      getErrorMessage: () => error,
    }),
    [
      isAuthenticated,
      user,
      loading,
      isopen,
      error,
      login,
      logout,
      fetchUser,
      refreshUser,
      clearError,
      retry,
      initialFetchComplete,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook with better error handling
export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// Enhanced HOC for protected routes with error handling
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading, error, clearError, retry, fetchUser } =
      useAuth();

    if (loading) {
      return (
        <div className="loader">
          <div className="box1"></div>
          <div className="box2"></div>
          <div className="box3"></div>
        </div>
      );
    }

    if (error && !isAuthenticated) {
      return (
        <div className="h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Authentication Error
              </h3>
              <p className="text-sm">{error}</p>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => retry(fetchUser)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Retry
              </button>
              <button
                onClick={clearError}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = `/signin?redirect_url=${encodeURIComponent(window.location.pathname)}`;
      return null;
    }

    return <Component {...props} />;
  };
};
