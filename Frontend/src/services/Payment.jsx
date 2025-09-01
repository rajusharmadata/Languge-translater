import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';
import axios from 'axios';

// Lucide React Icons
import { Crown, Check, X, Star, Shield, Zap, Globe, Clock, ArrowLeft } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  // Premium plans
  const plans = {
    monthly: {
      price: 3.99,
      name: 'Monthly Premium',
      duration: '1 month',
      originalPrice: 3.99,
      savings: null,
    },
    yearly: {
      price: 39.99,
      name: 'Yearly Premium',
      duration: '12 months',
      originalPrice: 47.88,
      savings: '$7.89',
    },
  };

  // Handle Razorpay payment
  const buyPlan = async planType => {
    setIsProcessing(true);

    try {
      // 1. Create order
      const orderRes = await axios.post('/api/v1/create-order', {
        amount: plans[planType].price,
        userId: user._id,
        planType: planType,
      });

      if (!orderRes.data.success) {
        throw new Error('Failed to create order');
      }

      // 2. Open Razorpay checkout
      const options = {
        key: orderRes.data.keyId,
        amount: orderRes.data.amount,
        currency: 'USD',
        name: 'Language Translator Pro',
        description: plans[planType].name,
        order_id: orderRes.data.orderId,
        handler: async function (response) {
          try {
            // 3. Verify payment
            const verifyRes = await axios.post('/api/v1/verify-payment', {
              ...response,
              userId: user._id,
              planType: planType,
            });

            if (verifyRes.data.success) {
              // Update user state
              setUser(prev => ({ ...prev, isPremium: true }));

              // Show success and redirect
              alert('🎉 Payment successful! You are now Premium!');
              navigate('/translate');
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed. Please try again.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || '',
        },
        theme: {
          color: '#374151',
        },
        modal: {
          ondismiss: function () {
            console.log('Payment cancelled by user');
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const features = [
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
    {
      icon: <Shield className='w-6 h-6' />,
      title: 'Priority Support',
      description: 'Get help when you need it most',
    },
    {
      icon: <Clock className='w-6 h-6' />,
      title: 'Translation History',
      description: 'Save and access your past translations',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800'>
      {/* Header */}
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6'>
        <div className='flex items-center justify-between'>
          <button
            onClick={() => navigate('/translate')}
            className='flex items-center space-x-2 text-white/80 hover:text-white transition-colors'
          >
            <ArrowLeft className='w-5 h-5' />
            <span>Back to Translator</span>
          </button>

          {user.isPremium && (
            <div className='flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold'>
              <Crown className='w-4 h-4' />
              <span>PREMIUM USER</span>
            </div>
          )}
        </div>
      </div>

      <main className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <div className='flex justify-center mb-6'>
            <div className='bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-full'>
              <Crown className='w-12 h-12 text-white' />
            </div>
          </div>

          <h1 className='text-4xl sm:text-6xl font-bold text-white mb-6'>
            Upgrade to
            <span className='bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent block sm:inline'>
              {' '}
              Premium
            </span>
          </h1>

          <p className='text-xl text-white/80 mb-8 max-w-2xl mx-auto'>
            Unlock unlimited translations and premium features. Perfect for professionals, students,
            and businesses.
          </p>

          <div className='flex items-center justify-center space-x-6 text-white/60'>
            <div className='flex items-center space-x-1'>
              <Star className='w-5 h-5 fill-yellow-400 text-yellow-400' />
              <span>4.9 Rating</span>
            </div>
            <span>•</span>
            <span>10M+ Users</span>
            <span>•</span>
            <span>30-Day Guarantee</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center'
            >
              <div className='flex justify-center mb-4 text-yellow-400'>{feature.icon}</div>
              <h3 className='text-white font-semibold text-lg mb-2'>{feature.title}</h3>
              <p className='text-white/70 text-sm'>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Section */}
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-white mb-4'>Choose Your Plan</h2>
            <p className='text-white/70'>Select the plan that works best for you</p>
          </div>

          <div className='grid md:grid-cols-2 gap-8 mb-8'>
            {/* Monthly Plan */}
            <div
              className={`relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border transition-all duration-300 cursor-pointer ${
                selectedPlan === 'monthly'
                  ? 'border-gray-400 ring-2 ring-gray-400'
                  : 'border-white/20 hover:border-gray-500'
              }`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className='text-center'>
                <h3 className='text-2xl font-bold text-white mb-2'>Monthly</h3>
                <div className='text-4xl font-bold text-white mb-6'>
                  ${plans.monthly.price}
                  <span className='text-lg text-white/70 font-normal'>/month</span>
                </div>

                <ul className='space-y-4 text-left mb-8'>
                  <li className='flex items-start space-x-3'>
                    <Check className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                    <span className='text-white/90'>Unlimited character translations</span>
                  </li>
                  <li className='flex items-start space-x-3'>
                    <Check className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                    <span className='text-white/90'>120+ languages supported</span>
                  </li>
                  <li className='flex items-start space-x-3'>
                    <Check className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                    <span className='text-white/90'>No advertisements</span>
                  </li>
                  <li className='flex items-start space-x-3'>
                    <Check className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                    <span className='text-white/90'>Priority customer support</span>
                  </li>
                  <li className='flex items-start space-x-3'>
                    <Check className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                    <span className='text-white/90'>Translation history & favorites</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Yearly Plan */}
            <div
              className={`relative bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-3xl p-8 border-2 transition-all duration-300 cursor-pointer ${
                selectedPlan === 'yearly'
                  ? 'border-yellow-400 ring-2 ring-yellow-400'
                  : 'border-yellow-500/30 hover:border-yellow-400'
              }`}
              onClick={() => setSelectedPlan('yearly')}
            >
              {/* Best Value Badge */}
              <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                <span className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg'>
                  MOST POPULAR
                </span>
              </div>

              <div className='text-center'>
                <h3 className='text-2xl font-bold text-white mb-2'>Yearly</h3>
                <div className='mb-4'>
                  <div className='text-4xl font-bold text-white'>
                    ${plans.yearly.price}
                    <span className='text-lg text-white/70 font-normal'>/year</span>
                  </div>
                  <div className='text-white/50 line-through text-lg'>
                    ${plans.yearly.originalPrice}
                  </div>
                  <div className='text-green-400 font-semibold text-lg'>
                    Save {plans.yearly.savings}!
                  </div>
                </div>

                <ul className='space-y-4 text-left mb-8'>
                  <li className='flex items-start space-x-3'>
                    <Check className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                    <span className='text-white/90'>Everything in Monthly plan</span>
                  </li>
                  <li className='flex items-start space-x-3'>
                    <Check className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                    <span className='text-white/90'>2 months completely FREE</span>
                  </li>
                  <li className='flex items-start space-x-3'>
                    <Check className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                    <span className='text-white/90'>Offline translation capability</span>
                  </li>
                  <li className='flex items-start space-x-3'>
                    <Check className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                    <span className='text-white/90'>Custom dictionaries</span>
                  </li>
                  <li className='flex items-start space-x-3'>
                    <Check className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                    <span className='text-white/90'>API access for developers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <div className='text-center'>
            <button
              onClick={() => buyPlan(selectedPlan)}
              disabled={isProcessing || user.isPremium}
              className={`w-full max-w-md mx-auto font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 ${
                selectedPlan === 'yearly'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white'
                  : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border border-white/20'
              }`}
            >
              {isProcessing ? (
                <div className='flex items-center justify-center space-x-2'>
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                  <span>Processing...</span>
                </div>
              ) : user.isPremium ? (
                <>
                  <Crown className='w-5 h-5 inline mr-2' />
                  Already Premium
                </>
              ) : (
                <>
                  Get Premium - ${plans[selectedPlan].price}
                  {selectedPlan === 'yearly' && (
                    <span className='block text-sm font-normal opacity-90'>
                      Save {plans.yearly.savings} compared to monthly
                    </span>
                  )}
                </>
              )}
            </button>


          </div>
        </div>

      
      </main>
    </div>
  );
};

export default Payment;
