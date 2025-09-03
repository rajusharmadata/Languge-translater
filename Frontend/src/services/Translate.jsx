import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import languages from '../db/languages';
import Primum from '../db/primum';
import LoginNav from '../components/LoginNav';
import FeatureCard from '../components/FeatureCard';
import { AuthContext } from '../context/authcontext';
import axios from 'axios';
import { ArrowRightLeft, Volume2, Copy, Star, Crown } from 'lucide-react';

const Translate = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useContext(AuthContext); // Replaced isopen with isAuthenticated

  // State variables
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Combine languages for premium users, standard for free users
  const availableLanguages = user?.isPremium
    ? [
        ...languages.map(lang => ({ ...lang, isPremium: false })),
        ...Primum.map(lang => ({ ...lang, isPremium: true })),
      ]
    : languages.map(lang => ({ ...lang, isPremium: false }));

  // Premium limit check
  const checkPremiumLimits = () => {
    const charLimit = 100;
    if (!user?.isPremium && sourceText.length > charLimit) {
      alert('Character limit reached! Upgrade to Premium for unlimited translations.');
      navigate('/price');
      return false;
    }
    // Check if sourceLang or targetLang is premium-only for free users
    const sourceIsPremium = availableLanguages.find(lang => lang.code === sourceLang)?.isPremium;
    const targetIsPremium = availableLanguages.find(lang => lang.code === targetLang)?.isPremium;
    if (!user?.isPremium && (sourceIsPremium || targetIsPremium)) {
      alert('Selected language is available for Premium users only. Upgrade to access.');
      navigate('/price');
      return false;
    }
    return true;
  };

  // Handle translation
  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    if (!checkPremiumLimits()) return;

    setIsTranslating(true);

    try {
      const response = await axios.post('/api/v1/translate', {
        text: sourceText,
        l1: sourceLang,
        l2: targetLang,
      });

      const translation =
        response.data?.translated ||
        `[Translated to ${
          availableLanguages.find(l => l.code === targetLang)?.name || 'Unknown'
        }]: ${sourceText}`;

      setTranslatedText(translation);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Swap languages
  const swapLanguages = () => {
    const sourceIsPremium = availableLanguages.find(lang => lang.code === sourceLang)?.isPremium;
    const targetIsPremium = availableLanguages.find(lang => lang.code === targetLang)?.isPremium;
    if (!user?.isPremium && (sourceIsPremium || targetIsPremium)) {
      alert('One of the selected languages is premium-only. Upgrade to access.');
      navigate('/price');
      return;
    }
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  // Copy to clipboard
  const copyToClipboard = async text => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  // Play audio
  const playAudio = (text, lang) => {
    try {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
      } else {
        console.warn('Speech synthesis not supported');
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  // Redirect to sign-in if not authenticated
  if (!loading && (!isAuthenticated || !user)) {
    navigate('/signin?redirect_url=/translate');
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
    <div className='min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 overflow-hidden'>
      <LoginNav />

      {/* Hero Section */}
      <main className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 transition-opacity duration-300'>
        {/* Header */}
        <div className='text-center mb-8 sm:mb-12'>
          <h2 className='text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2'>
            Break Language
            <span className='bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent block sm:inline'>
              {' '}
              Barriers
            </span>
          </h2>
          <p className='text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-4'>
            Translate text instantly with AI-powered precision. Connect with the world in over{' '}
            {user?.isPremium ? '120+' : '50+'} languages.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-white/60 text-sm sm:text-base'>
            {user?.isPremium && (
              <div className='flex items-center space-x-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse'>
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
            <span>{user?.isPremium ? 'Unlimited' : 'Free to Use'}</span>
          </div>
        </div>

        {/* Translation Box */}
        <div className='max-w-7xl mx-auto px-2 sm:px-0'>
          <div className='bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl'>
            {/* Language Selectors */}
            <div className='flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0'>
              <div className='w-full sm:w-auto'>
                <select
                  id='sourceLang'
                  value={sourceLang}
                  onChange={e => setSourceLang(e.target.value)}
                  className='w-full sm:w-auto bg-white/10 text-white border border-white/20 rounded-lg px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500'
                  aria-label='Select source language'
                >
                  {availableLanguages.map(lang => (
                    <option
                      key={lang.code}
                      value={lang.code}
                      className='text-gray-900 bg-white'
                      disabled={!user?.isPremium && lang.isPremium}
                    >
                      {lang.flag} {lang.name}
                      {lang.isPremium && (
                        <span className='ml-2 text-yellow-400 inline-flex items-center'>
                          <Crown className='w-3 h-3 inline' /> Premium
                        </span>
                      )}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={swapLanguages}
                className='p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors transform hover:scale-105'
                aria-label='Swap languages'
              >
                <ArrowRightLeft className='w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-300' />
              </button>

              <div className='w-full sm:w-auto'>
                <select
                  id='targetLang'
                  value={targetLang}
                  onChange={e => setTargetLang(e.target.value)}
                  className='w-full sm:w-auto bg-white/10 text-white border border-white/20 rounded-lg px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500'
                  aria-label='Select target language'
                >
                  {availableLanguages.map(lang => (
                    <option
                      key={lang.code}
                      value={lang.code}
                      className='text-gray-900 bg-white'
                      disabled={!user?.isPremium && lang.isPremium}
                    >
                      {lang.flag} {lang.name}
                      {lang.isPremium && (
                        <span className='ml-2 text-yellow-400 inline-flex items-center'>
                          <Crown className='w-3 h-3 inline' /> Premium
                        </span>
                      )}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Text Areas */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
              {/* Input */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <label className='text-white/80 font-medium text-sm sm:text-base'>
                    Enter text
                  </label>
                  {sourceText && (
                    <button
                      onClick={() => playAudio(sourceText, sourceLang)}
                      className='p-1 rounded hover:bg-white/10'
                      aria-label='Play source text audio'
                    >
                      <Volume2 className='w-3 h-3 sm:w-4 sm:h-4 text-white/60' />
                    </button>
                  )}
                </div>
                <textarea
                  value={sourceText}
                  onChange={e => setSourceText(e.target.value)}
                  placeholder='Type or paste text here...'
                  className='w-full h-56 bg-white/5 border border-white/20 rounded-lg p-3 sm:p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none text-sm sm:text-base'
                  maxLength={user?.isPremium ? 5000 : 100}
                  aria-label='Source text input'
                />
                <div className='flex justify-between items-center text-xs text-white/60'>
                  <span>
                    {sourceText.length} / {user?.isPremium ? '5000' : '100'} characters
                  </span>
                  {!user?.isPremium && sourceText.length > 80 && (
                    <button
                      onClick={() => navigate('/price')}
                      className='text-yellow-400 hover:text-yellow-300 underline'
                      aria-label='Upgrade for unlimited characters'
                    >
                      Upgrade for unlimited
                    </button>
                  )}
                </div>
                {!user?.isPremium && sourceText.length > 100 && (
                  <div className='bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-yellow-200 text-sm'>
                    <div className='flex items-center space-x-2'>
                      <Crown className='w-4 h-4' />
                      <span>
                        Character limit reached!
                        <button
                          onClick={() => navigate('/price')}
                          className='underline hover:text-yellow-100 ml-1'
                          aria-label='Upgrade to Premium'
                        >
                          Upgrade to Premium
                        </button>{' '}
                        for unlimited translations.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Output */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <label className='text-white/80 font-medium text-sm sm:text-base'>
                    Translation
                  </label>
                  {translatedText && (
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => playAudio(translatedText, targetLang)}
                        className='p-1 rounded hover:bg-white/10'
                        aria-label='Play translated text audio'
                      >
                        <Volume2 className='w-3 h-3 sm:w-4 sm:h-4 text-white/60' />
                      </button>
                      <button
                        onClick={() => copyToClipboard(translatedText)}
                        className={`p-1 rounded hover:bg-white/10 ${
                          copySuccess ? 'text-green-400' : ''
                        }`}
                        aria-label='Copy translated text'
                      >
                        <Copy className='w-3 h-3 sm:w-4 sm:h-4 text-white/60' />
                      </button>
                    </div>
                  )}
                </div>
                <div
                  className='w-full h-56 bg-white/5 border border-white/20 rounded-lg p-3 sm:p-4 text-white overflow-y-auto text-sm sm:text-base'
                  aria-live='polite'
                >
                  {isTranslating ? (
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                      <div
                        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
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

            {/* Buttons */}
            <div className='mt-4 sm:mt-6 text-center'>
              <button
                onClick={handleTranslate}
                disabled={!sourceText.trim() || isTranslating}
                className='w-full sm:w-auto bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 text-sm sm:text-base border border-white/20'
                aria-label='Translate text'
              >
                {isTranslating ? 'Translating...' : 'Translate'}
              </button>
              {!user?.isPremium && (
                <button
                  onClick={() => navigate('/payment')}
                  className='ml-0 sm:ml-4 mt-2 sm:mt-0 w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base'
                  aria-label='Upgrade to Premium'
                >
                  <Crown className='w-4 h-4 inline mr-2' />
                  Upgrade to Premium
                </button>
              )}
            </div>
          </div>
        </div>

        <FeatureCard />
      </main>

      {copySuccess && (
        <div className='fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300'>
          Text copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default Translate;
