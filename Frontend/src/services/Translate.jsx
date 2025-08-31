import React, { useContext, useState } from 'react';
import languages from '../db/languages';
import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import { AuthContext } from '../context/authcontext';

import axios from 'axios';

// Lucide React Icons
import { ArrowRightLeft, Volume2, Copy, Star, Crown, X } from 'lucide-react';

const Translate = () => {
  // State variables for managing text and settings
  const [sourceText, setSourceText] = useState(''); // User input text
  const [translatedText, setTranslatedText] = useState(''); // Resulting translated text
  const [sourceLang, setSourceLang] = useState('en'); // Selected source language code
  const [targetLang, setTargetLang] = useState('es'); // Selected target language code
  const [isTranslating, setIsTranslating] = useState(false); // Loader state while translating
  const [copySuccess, setCopySuccess] = useState(false); // Copy feedback state

  // Premium upgrade states
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [user, setUser] = useState({ isPremium: false, _id: '68b3f3a343ff631336558140' }); // Replace with actual user from context

  // Get context values with error handling
  const context = useContext(AuthContext);
  const { isopen } = context || { isopen: false };

  // Premium plans
  const plans = {
    monthly: { price: 1, name: 'Monthly Premium', duration: '1 month' },
    yearly: { price: 2999, name: 'Yearly Premium', duration: '12 months', savings: '₹589' },
  };

  // Check premium limits before translation
  const checkPremiumLimits = () => {
    const charLimit = 100; // Free user character limit

    if (!user.isPremium && sourceText.length > charLimit) {
      setShowUpgrade(true);
      return false;
    }
    return true;
  };

  // Handle translation with premium check
  const handleTranslate = async () => {
    if (!sourceText.trim()) return; // Prevent empty translations

    // Check premium limits first
    if (!checkPremiumLimits()) {
      return; // Stop if upgrade is needed
    }

    setIsTranslating(true); // Show loader

    try {
      // API call
      const response = await axios.post('/api/v1/translate', {
        text: sourceText,
        l1: sourceLang, // use dynamic selected lang
        l2: targetLang,
      });
      console.log(response);

      // If backend sends translation in response.data.translation
      const translation =
        response.data?.translated ||
        `[Translated to ${
          languages.find(l => l.code === targetLang)?.name || 'Unknown'
        }]: ${sourceText}`;

      setTranslatedText(translation);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Handle Razorpay payment
  const buyPlan = async planType => {
    try {
      // 1. Create order
      const orderRes = await axios.post('/api/v1/create-order', {
        amount: plans[planType].price,
        userId: user._id,
      });

      if (!orderRes.data.success) {
        throw new Error('Failed to create order');
      }

      // 2. Open Razorpay checkout
      const options = {
        key: orderRes.data.keyId,
        amount: orderRes.data.amount,
        currency: 'INR',
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
              alert('🎉 Payment successful! You are now Premium!');
              setUser(prev => ({ ...prev, isPremium: true }));
              setShowUpgrade(false);
              // Optionally refresh user data from backend
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed. Please try again.');
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || '',
        },
        theme: {
          color: '#374151', // Matches your gray theme
        },
        modal: {
          ondismiss: function () {
            console.log('Payment cancelled by user');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  // Swap source and target languages
  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  // Copy text to clipboard with feedback
  const copyToClipboard = async text => {
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      // Show success feedback
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      // Could add error toast here
    }
  };

  // Play audio pronunciation of text with error handling
  const playAudio = (text, lang) => {
    try {
      // Check if speech synthesis is supported
      if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.8; // Slightly slower for better comprehension
        utterance.volume = 0.8;

        // Handle speech errors
        utterance.onerror = event => {
          console.error('Speech synthesis error:', event.error);
        };

        speechSynthesis.speak(utterance);
      } else {
        console.warn('Speech synthesis not supported in this browser');
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-hidden'>
      {/* Navbar component */}

      {/* Hero Section - Dimmed when mobile menu is open */}
      <main
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 transition-opacity duration-300 ${
          isopen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Header Section */}
        <div className='text-center mb-8 sm:mb-12'>
          {/* Main Heading */}
          <h2 className='text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2'>
            Break Language
            <span className='bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent block sm:inline'>
              {' '}
              Barriers
            </span>
          </h2>

          {/* Subheading */}
          <p className='text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-4'>
            Translate text instantly with AI-powered precision. Connect with the world in over 120
            languages.
          </p>

          {/* Premium Badge and Stats */}
          <div className='flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-white/60 text-sm sm:text-base'>
            {user.isPremium && (
              <div className='flex items-center space-x-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold'>
                <Crown className='w-3 h-3' />
                <span>PREMIUM</span>
              </div>
            )}
            <div className='flex items-center space-x-1'>
              <Star className='w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400' />
              <span>4.9 Rating</span>
            </div>
            <span className='hidden sm:inline'>•</span>
            <span>10M+ Translations</span>
            <span className='hidden sm:inline'>•</span>
            <span>{user.isPremium ? 'Unlimited' : 'Free to Use'}</span>
          </div>
        </div>

        {/* Translation Interface Container */}
        <div className='max-w-7xl mx-auto px-2 sm:px-0 '>
          <div className='bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl'>
            {/* Language Selection Controls */}
            <div className='flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0'>
              {/* Source Language Dropdown */}
              <div className='w-full sm:w-auto'>
                <label htmlFor='sourceLang' className='sr-only'>
                  Source Language
                </label>
                <select
                  id='sourceLang'
                  value={sourceLang}
                  onChange={e => setSourceLang(e.target.value)}
                  className='w-full sm:w-auto bg-white/10 text-white border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base'
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code} className='text-gray-900 bg-white'>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language Swap Button */}
              <button
                onClick={swapLanguages}
                className='p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors group order-last sm:order-none'
                aria-label='Swap languages'
                title='Swap languages'
              >
                <ArrowRightLeft className='w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-180 transition-transform duration-300' />
              </button>

              {/* Target Language Dropdown */}
              <div className='w-full sm:w-auto'>
                <label htmlFor='targetLang' className='sr-only'>
                  Target Language
                </label>
                <select
                  id='targetLang'
                  value={targetLang}
                  onChange={e => setTargetLang(e.target.value)}
                  className='w-full sm:w-auto bg-white/10 text-white border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base'
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code} className='text-gray-900 bg-white'>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Text Input and Output Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 '>
              {/* Source Text Input Section */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor='sourceText'
                    className='text-white/80 font-medium text-sm sm:text-base'
                  >
                    Enter text
                  </label>
                  {sourceText && (
                    <button
                      onClick={() => playAudio(sourceText, sourceLang)}
                      className='p-1 rounded hover:bg-white/10 transition-colors'
                      aria-label='Play source text audio'
                      title='Play audio'
                    >
                      <Volume2 className='w-3 h-3 sm:w-4 sm:h-4 text-white/60' />
                    </button>
                  )}
                </div>
                <textarea
                  id='sourceText'
                  value={sourceText}
                  onChange={e => setSourceText(e.target.value)}
                  placeholder='Type or paste text here...'
                  className='w-full h-56 bg-white/5 border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none text-sm sm:text-base'
                  maxLength={user.isPremium ? 5000 : 100}
                />

                {/* Character limit indicator */}
                <div className='flex justify-between items-center text-xs text-white/60'>
                  <span>
                    {sourceText.length} / {user.isPremium ? '5000' : '100'} characters
                  </span>
                  {!user.isPremium && sourceText.length > 80 && (
                    <button
                      onClick={() => setShowUpgrade(true)}
                      className='text-yellow-400 hover:text-yellow-300 underline'
                    >
                      Upgrade for unlimited
                    </button>
                  )}
                </div>

                {/* Premium limit warning */}
                {!user.isPremium && sourceText.length > 100 && (
                  <div className='bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-yellow-200 text-sm'>
                    <div className='flex items-center space-x-2'>
                      <Crown className='w-4 h-4' />
                      <span>
                        Character limit reached! Upgrade to Premium for unlimited translations.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Translation Output Section */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <label className='text-white/80 font-medium text-sm sm:text-base'>
                    Translation
                  </label>
                  {translatedText && (
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => playAudio(translatedText, targetLang)}
                        className='p-1 rounded hover:bg-white/10 transition-colors'
                        aria-label='Play translated text audio'
                        title='Play audio'
                      >
                        <Volume2 className='w-3 h-3 sm:w-4 sm:h-4 text-white/60' />
                      </button>
                      <button
                        onClick={() => copyToClipboard(translatedText)}
                        className={`p-1 rounded hover:bg-white/10 transition-colors ${
                          copySuccess ? 'text-green-400' : ''
                        }`}
                        aria-label='Copy translated text'
                        title={copySuccess ? 'Copied!' : 'Copy to clipboard'}
                      >
                        <Copy className='w-3 h-3 sm:w-4 sm:h-4 text-white/60' />
                      </button>
                    </div>
                  )}
                </div>
                <div className='w-full h-56 bg-white/5 border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white overflow-y-auto text-sm sm:text-base'>
                  {isTranslating ? (
                    // Translation loading animation
                    <div className='flex items-center space-x-2'>
                      <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce'></div>
                      <div
                        className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <span className='text-white/60 text-xs sm:text-sm ml-2'>Translating...</span>
                    </div>
                  ) : (
                    translatedText || (
                      <span className='text-white/40'>Translation will appear here...</span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Translation Action Button */}
            <div className='mt-4 sm:mt-6 text-center'>
              <button
                onClick={handleTranslate}
                disabled={!sourceText.trim() || isTranslating}
                className='w-full sm:w-auto bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 text-sm sm:text-base border border-white/20'
              >
                {isTranslating ? 'Translating...' : 'Translate'}
              </button>

              {/* Quick upgrade button for non-premium users */}
              {!user.isPremium && (
                <button
                  onClick={() => setShowUpgrade(true)}
                  className='ml-0 sm:ml-4 mt-2 sm:mt-0 w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base'
                >
                  <Crown className='w-4 h-4 inline mr-2' />
                  Upgrade to Premium
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
      </main>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700'>
            {/* Modal Header */}
            <div className='flex items-center justify-between p-6 border-b border-gray-700'>
              <h3 className='text-2xl font-bold text-white flex items-center'>
                <Crown className='w-6 h-6 text-yellow-400 mr-2' />
                Upgrade to Premium
              </h3>
              <button
                onClick={() => setShowUpgrade(false)}
                className='p-2 hover:bg-gray-800 rounded-lg transition-colors'
              >
                <X className='w-5 h-5 text-gray-400' />
              </button>
            </div>

            {/* Modal Content */}
            <div className='p-6'>
              <p className='text-gray-300 text-center mb-8'>
                Unlock unlimited translations and premium features for your language needs
              </p>

              {/* Pricing Cards */}
              <div className='grid md:grid-cols-2 gap-6 mb-8'>
                {/* Monthly Plan */}
                <div className='bg-gray-800/50 border border-gray-600 rounded-xl p-6 hover:border-gray-500 transition-colors'>
                  <div className='text-center'>
                    <h4 className='text-xl font-bold text-white mb-2'>Monthly</h4>
                    <div className='text-3xl font-bold text-white mb-4'>
                      ₹{plans.monthly.price}
                      <span className='text-sm text-gray-400 font-normal'>/month</span>
                    </div>
                    <ul className='text-left space-y-2 text-gray-300 mb-6'>
                      <li>✓ Unlimited character translations</li>
                      <li>✓ 120+ languages</li>
                      <li>✓ No ads</li>
                      <li>✓ Priority support</li>
                      <li>✓ History & favorites</li>
                    </ul>
                    <button
                      onClick={() => buyPlan('monthly')}
                      className='w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-200'
                    >
                      Choose Monthly
                    </button>
                  </div>
                </div>

                {/* Yearly Plan */}
                <div className='bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl p-6 relative'>
                  <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                    <span className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold'>
                      BEST VALUE
                    </span>
                  </div>
                  <div className='text-center'>
                    <h4 className='text-xl font-bold text-white mb-2'>Yearly</h4>
                    <div className='text-3xl font-bold text-white mb-1'>
                      ₹{plans.yearly.price}
                      <span className='text-sm text-gray-400 font-normal'>/year</span>
                    </div>
                    <p className='text-green-400 text-sm mb-4'>Save {plans.yearly.savings}!</p>
                    <ul className='text-left space-y-2 text-gray-300 mb-6'>
                      <li>✓ Everything in Monthly</li>
                      <li>✓ 2 months FREE</li>
                      <li>✓ Offline translation</li>
                      <li>✓ Custom dictionaries</li>
                      <li>✓ API access</li>
                    </ul>
                    <button
                      onClick={() => buyPlan('yearly')}
                      className='w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105'
                    >
                      Choose Yearly
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className='text-center text-gray-400 text-sm'>
                🔒 Secure payment powered by Razorpay • Cancel anytime • 30-day money-back guarantee
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copy Success Notification */}
      {copySuccess && (
        <div className='fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300'>
          Text copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default Translate;
