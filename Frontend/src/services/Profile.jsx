import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';
import { User, Crown, ArrowLeft, Zap, Globe, Clock, Edit, CreditCard } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  // Redirect to sign-in if not authenticated
  if (!loading && (!isAuthenticated || !user)) {
    navigate('/signin?redirect_url=/profile');
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-gray-900 to-gray-800'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4'></div>
          <div className='text-white text-xl'>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-6 py-12'>
     

      {/* Hero Section */}
      <div className='max-w-4xl mx-auto text-center mb-12'>
        <div className='flex justify-center mb-6'>
          <div className='bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-full animate-bounce'>
            <User className='w-12 h-12 text-white' />
          </div>
        </div>
        <h1 className='text-4xl sm:text-6xl font-bold text-white mb-6'>
          Your
          <span className='bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent block sm:inline'>
            {' '}
            Profile
          </span>
        </h1>
        <p className='text-xl text-white/80 mb-8 max-w-2xl mx-auto'>
          Manage your account details and explore your premium benefits.
        </p>
      </div>

      {/* Profile Card */}
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-12 transition-all duration-300 transform hover:scale-105'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-white mb-4'>Account Details</h2>
            <div className='space-y-4 text-left max-w-md mx-auto'>
              <div className='flex items-center justify-between'>
                <span className='text-white/70'>Name:</span>
                <span className='text-white font-semibold'>{user?.name || 'N/A'}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-white/70'>Email:</span>
                <span className='text-white font-semibold'>{user?.email || 'N/A'}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-white/70'>Phone:</span>
                <span className='text-white font-semibold'>{user?.phone || 'N/A'}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-white/70'>Plan:</span>
                <span className='text-white font-semibold'>
                  {user?.isPremium ? 'Premium' : 'Free'}
                  {user?.isPremium && <Crown className='w-5 h-5 inline ml-2 text-yellow-400' />}
                </span>
              </div>
            </div>
            <div className='mt-8 flex flex-col sm:flex-row justify-center gap-4'>

              <button
                onClick={() => navigate('/payment')}
                className='flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105'
                aria-label='Manage Subscription'
              >
                <CreditCard className='w-5 h-5' />
                <span>Manage Subscription</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Benefits Section */}
      {user?.isPremium && (
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-3xl font-bold text-white text-center mb-8'>Your Premium Benefits</h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
            {[
              {
                icon: <Zap className='w-6 h-6' />,
                title: 'Unlimited Translations',
                description: 'No character limits or daily restrictions',
              },
              {
                icon: <Globe className='w-6 h-6' />,
                title: '120+ Languages',
                description: 'Access to all supported languages',
              },

            ].map((benefit, index) => (
              <div
                key={index}
                className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transition-transform hover:scale-105'
              >
                <div className='flex justify-center mb-4 text-yellow-400'>{benefit.icon}</div>
                <h3 className='text-white font-semibold text-lg mb-2'>{benefit.title}</h3>
                <p className='text-white/70 text-sm'>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Closing Line */}
      <div className='mt-16 text-center text-white/60'>
        Manage your account and enjoy seamless translations with your plan.
      </div>
    </div>
  );
};

export default Profile;
