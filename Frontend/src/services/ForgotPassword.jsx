import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Lock, Send } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleEmailChange = e => {
    setEmail(e.target.value);
    setSubmitStatus(null);
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      setSubmitStatus('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setSubmitStatus('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Replace with your actual password reset endpoint
      const response = await axios.post('/api/v1/forgot-password', {
        email: email,
      });
      console.log(response);

        // Remove "|| true" in production
        setIsEmailSent(true);
        setSubmitStatus(null);

    } catch (error) {
      setSubmitStatus('Network error. Please check your connection and try again.',error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (isEmailSent) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full'>
          <div className='bg-white rounded-2xl shadow-2xl p-8 text-center'>
            <div className='bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6'>
              <CheckCircle className='w-10 h-10 text-green-600' />
            </div>

            <h1 className='text-2xl font-bold text-gray-900 mb-4'>Check Your Email</h1>

            <p className='text-gray-600 mb-6'>
              We've sent a password reset link to <br />
              <span className='font-semibold text-gray-900'>{email}</span>
            </p>

            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
              <p className='text-sm text-blue-800'>
                <strong>Didn't receive the email?</strong>
                <br />
                Check your spam folder or click the button below to resend.
              </p>
            </div>

            <div className='space-y-3'>
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                }}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2'
              >
                <Send className='w-5 h-5' />
                <span>Resend Email</span>
              </button>

              <button
                onClick={() => window.history.back()}
                className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2'
              >
                <ArrowLeft className='w-5 h-5' />
                <span>Back to Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 borderflex items-center justify-center px-4 sm:px-6 lg:px-8 flex
     '>
      <div className='max-w-md w-full'>
        <div className=' text-white rounded-sm border border-gray-500 shadow-2xl p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Lock className='w-10 h-10 text-blue-600' />
            </div>
            <h1 className='text-3xl font-bold '>Forgot Password?</h1>

          </div>

          {/* Error Message */}
          {submitStatus && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3'>
              <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0' />
              <p className='text-red-800 text-sm'>{submitStatus}</p>
            </div>
          )}

          {/* Email Input */}
          <div className='mb-6'>
            <label htmlFor='email' className='block text-sm font-medium mb-2'>
              Email Address
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Mail className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='email'
                id='email'
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg  transition-colors'
                placeholder='Enter your email address'
                autoComplete='email'
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !email.trim()}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 mb-6'
          >
            {isSubmitting ? (
              <>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                <span>Sending Reset Link...</span>
              </>
            ) : (
              <>
                <Send className='w-5 h-5' />
                <span>Send Reset Link</span>
              </>
            )}
          </button>

          {/* Back to Login */}
          <div className='text-center'>
            <button
              onClick={() => window.history.back()}
              className='text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center space-x-2 mx-auto transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              <span>Back to Login</span>
            </button>
          </div>



        </div>



      </div>
    </div>
  );
};
export default ForgotPassword;
