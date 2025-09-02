import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { TbPasswordUser, TbPasswordFingerprint } from 'react-icons/tb';
import { useAuth } from '../context/authcontext';

const SignIn = () => {
  const [formdata, setFormdata] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localMessage, setLocalMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Use AuthContext
  const {
    login,
    loading,
    isAuthenticated,
    error,
    clearError,
    retry,
    fetchUser,
    isInitialLoadComplete,
  } = useAuth();

  // Get redirect URL from query params
  const params = new URLSearchParams(location.search);
  const redirectUrl = params.get('redirect_url') || '/translate';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && isInitialLoadComplete()) {
      console.log('User is already authenticated, redirecting to:', redirectUrl);
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl, isInitialLoadComplete]);

  // Clear errors when component mounts or user starts typing
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const onChangeHandler = event => {
    const { name, value } = event.target;
    setFormdata(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error messages when user starts typing
    if (localMessage) {
      setLocalMessage('');
    }
    if (error) {
      clearError();
    }
  };

  const submitHandler = async event => {
    event.preventDefault();

    // Prevent double submission
    if (isSubmitting || loading) {
      return;
    }

    // Basic validation
    if (!formdata.email?.trim() || !formdata.password?.trim()) {
      setLocalMessage('Please fill in all fields');
      return;
    }

    if (!formdata.email.includes('@')) {
      setLocalMessage('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setLocalMessage('');
      clearError();

      console.log('Attempting login with:', { email: formdata.email.trim() });

      // Use AuthContext login function
      const result = await login(formdata.email.trim(), formdata.password);

      console.log('Login result:', result);

      if (result && result.success) {
        console.log('Login successful, user:', result.user);
        setLocalMessage('Login successful! Redirecting...');
        navigate('/translate');

        // Clear form
        setFormdata({ email: '', password: '' });

        // Navigate after a short delay
        setTimeout(() => {
          navigate(redirectUrl, { replace: true });
        }, 1000);
      } else {
        // Login failed - error is already set in context, but show local message too
        const errorMessage = result?.message || 'Login failed. Please check your credentials.';
        console.log('Login failed:', errorMessage);
        setLocalMessage(errorMessage);
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
      setLocalMessage('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = async () => {
    setLocalMessage('');
    await retry(fetchUser);
  };

  // Show loading if AuthContext is still initializing
  if (loading && !isInitialLoadComplete()) {
    return (
      <div className='h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-800'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <div className='text-white text-xl'>Loading...</div>
        </div>
      </div>
    );
  }

  // Display the current error message (either from context or local)
  const displayMessage = localMessage || error;
  const isSuccess = displayMessage && displayMessage.includes('successful');
  const isError = displayMessage && !isSuccess;

  return (
    <div className='h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-800'>
      <div className='w-96 py-10 bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-black/60 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-gray-700/40'>
        <h2 className='text-3xl font-bold text-center text-white mb-6 tracking-wide'>Sign In</h2>

        <div className='space-y-5'>
          {/* Error/Success Message */}
          {displayMessage && (
            <div
              className={`border px-4 py-3 rounded-lg text-center text-sm transition-all duration-300 ${
                isSuccess
                  ? 'bg-green-500/20 border-green-500/50 text-green-200'
                  : 'bg-red-500/20 border-red-500/50 text-red-200'
              }`}
            >
              <div className='flex items-center justify-between'>
                <span className='flex-1'>{displayMessage}</span>
                {isError && !isSubmitting && (
                  <div className='flex space-x-2 ml-2'>
                    <button
                      onClick={handleRetry}
                      className='text-xs bg-red-600/50 hover:bg-red-600/70 px-2 py-1 rounded transition-colors'
                      title='Retry'
                    >
                      Retry
                    </button>
                    <button
                      onClick={() => {
                        setLocalMessage('');
                        clearError();
                      }}
                      className='text-xs bg-gray-600/50 hover:bg-gray-600/70 px-2 py-1 rounded transition-colors'
                      title='Dismiss'
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-300 mb-2'>
              Email Address
            </label>
            <div className='relative'>
              <span className='absolute top-3 left-2 text-gray-400 pointer-events-none z-10'>
                <TbPasswordUser size={20} />
              </span>
              <input
                type='email'
                id='email'
                name='email'
                placeholder='example@gmail.com'
                value={formdata.email}
                onChange={onChangeHandler}
                disabled={isSubmitting || loading}
                className='w-full px-4 pl-10 py-3 rounded-lg bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
                required
                autoComplete='email'
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-300 mb-2'>
              Password
            </label>
            <div className='relative'>
              <span className='absolute top-3 left-2 text-gray-400 pointer-events-none z-10'>
                <TbPasswordFingerprint size={20} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                name='password'
                placeholder='••••••••'
                value={formdata.password}
                onChange={onChangeHandler}
                disabled={isSubmitting || loading}
                className='w-full px-4 pl-10 pr-12 py-3 rounded-lg bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
                required
                autoComplete='current-password'
              />
              <button
                type='button'
                className='absolute top-3 right-3 text-gray-400 hover:text-white transition-colors disabled:cursor-not-allowed z-10'
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting || loading}
                tabIndex={-1}
              >
                {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className='text-right mt-2'>
              <Link
                to='/forgotPassword'
                className='text-blue-400 hover:text-blue-300 text-sm transition-colors'
                tabIndex={isSubmitting || loading ? -1 : 0}
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isSubmitting || loading}
            onClick={submitHandler}
            className='w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
          >
            {isSubmitting || loading ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                {isSubmitting ? 'Signing In...' : 'Loading...'}
              </>
            ) : (
              'Continue'
            )}
          </button>

          {/* Sign Up Link */}
          <p className='text-center text-gray-300'>
            Don't have an account?{' '}
            <button
              type='button'
              onClick={() => !isSubmitting && !loading && navigate('/signup')}
              className='text-blue-400 hover:text-blue-300 transition-colors font-medium disabled:opacity-50'
              disabled={isSubmitting || loading}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
