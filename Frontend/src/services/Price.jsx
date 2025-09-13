import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';
import axios from 'axios';
import { Crown, Check, ArrowLeft, Zap, Globe, Clock, Star } from 'lucide-react';

const Price = () => {
  const navigate = useNavigate();
  const { user, setUser, loading, isAuthenticated } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  // Plans data (simplified, no customer-specific features)
  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Premium',
      price: '$3.99',
      period: '/month',
      features: [
        'Unlimited character translations',
        '120+ languages supported',
        'No advertisements',
      ],
      button: 'Choose Monthly',
      highlight: false,
      rawPrice: 3.99,
    },
    {
      id: 'yearly',
      name: 'Yearly Premium',
      price: '$39.99',
      period: '/year',
      features: [
        'Everything in Monthly plan',
        'Unlimited character translations',
        '120+ languages supported',
      ],
      button: 'Choose Yearly',
      highlight: true,
      rawPrice: 39.99,
      savings: 'Save $7.89',
      originalPrice: 47.88,
    },
  ];

  // Handle Razorpay payment
  const buyPlan = async (planId) => {
    if (!isAuthenticated || !user) {
      navigate(`/signin?redirect_url=${encodeURIComponent('/#price')}`);
      return;
    }

    setIsProcessing(true);

    try {
      const selectedPlanData = plans.find((plan) => plan.id === planId);
      if (!selectedPlanData) {
        throw new Error('Invalid plan selected');
      }

      // Create order
      const orderRes = await axios.post('/api/v1/create-order', {
        amount: selectedPlanData.rawPrice,
        userId: user._id,
        planType: planId,
      });

      if (!orderRes.data.success) {
        throw new Error('Failed to create order');
      }

      // Open Razorpay checkout
      const options = {
        key: orderRes.data.keyId,
        amount: orderRes.data.amount,
        currency: 'USD',
        name: 'Language Translator Pro',
        description: selectedPlanData.name,
        order_id: orderRes.data.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyRes = await axios.post('/api/v1/verify-payment', {
              ...response,
              userId: user._id,
              planType: planId,
            });

            if (verifyRes.data.success) {
              setUser((prev) => ({ ...prev, isPremium: true }));
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white px-6 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-full animate-bounce">
            <Crown className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
          Unlock
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent block sm:inline">
            {' '}
            Premium
          </span>
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Seamless translations with plans tailored for you—go limitless today.
        </p>
        <div className="flex items-center justify-center space-x-6 text-white/60">
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span>4.9 Rating</span>
          </div>
          <span>•</span>
          <span>10M+ Users</span>
          <span>•</span>
          <span>30-Day Guarantee</span>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-white/70">
            Select the plan that works best for you
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                selectedPlan === plan.id
                  ? 'border-yellow-400 ring-2 ring-yellow-400'
                  : plan.highlight
                    ? 'border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10'
                    : 'border-white/20 hover:border-yellow-500/30'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedPlan(plan.id)}
              aria-label={`Select ${plan.name} plan`}
            >
              {/* Highlight Badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <div className="text-4xl font-bold text-white">
                    {plan.price}
                  </div>
                  <span className="text-white/70">{plan.period}</span>
                  {plan.savings && (
                    <div className="text-green-400 font-semibold text-lg mt-2">
                      {plan.savings}
                    </div>
                  )}
                  {plan.originalPrice && (
                    <div className="text-white/50 line-through text-lg">
                      ${plan.originalPrice}
                    </div>
                  )}
                </div>

                <ul className="mt-6 space-y-4 text-left mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => buyPlan(plan.id)}
                  disabled={
                    isProcessing || (isAuthenticated && user?.isPremium)
                  }
                  className={`w-full font-bold py-3 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 ${
                    selectedPlan === plan.id
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white'
                      : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border border-white/20'
                  }`}
                  aria-disabled={
                    isProcessing || (isAuthenticated && user?.isPremium)
                  }
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : isAuthenticated && user?.isPremium ? (
                    <>
                      <Crown className="w-5 h-5 inline mr-2" />
                      Already Premium
                    </>
                  ) : (
                    `Get ${plan.name}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Purchase Button */}
        <div className="text-center">
          <button
            onClick={() => buyPlan(selectedPlan)}
            disabled={isProcessing || (isAuthenticated && user?.isPremium)}
            className={`w-full max-w-md mx-auto font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 ${
              selectedPlan === 'yearly'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white'
                : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border border-white/20'
            }`}
            aria-disabled={isProcessing || (isAuthenticated && user?.isPremium)}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : isAuthenticated && user?.isPremium ? (
              <>
                <Crown className="w-5 h-5 inline mr-2" />
                Already Premium
              </>
            ) : (
              <>
                Get Premium - $
                {plans.find((plan) => plan.id === selectedPlan)?.rawPrice}
                {selectedPlan === 'yearly' && (
                  <span className="block text-sm font-normal opacity-90">
                    Save {plans.find((plan) => plan.id === 'yearly')?.savings}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          What’s Included in Premium
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'Unlimited Translations',
              description: 'No character limits or daily restrictions',
            },
            {
              icon: <Globe className="w-6 h-6" />,
              title: '120+ Languages',
              description: 'Access to all supported languages',
            },
            {
              icon: <Clock className="w-6 h-6" />,
              title: 'Translation History',
              description: 'Save and access your past translations',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transition-transform hover:scale-105"
            >
              <div className="flex justify-center mb-4 text-yellow-400">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-white/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Line */}
      <div className="mt-16 text-center text-white/60">
        Flexible pricing to help you communicate without limits.
      </div>
    </div>
  );
};

export default Price;
