import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import languages from '../db/languages';
import LoginNav from '../components/LoginNav';
import FeatureCard from '../components/FeatureCard';
import { AuthContext } from '../context/authcontext';

import axios from 'axios';

// Lucide React Icons
import { ArrowRightLeft, Volume2, Copy, Star, Crown } from 'lucide-react';

const Translate = () => {
  const navigate = useNavigate();

  // State variables for managing text and settings
  const [sourceText, setSourceText] = useState(''); // User input text
  const [translatedText, setTranslatedText] = useState(''); // Resulting translated text
  const [sourceLang, setSourceLang] = useState('en'); // Selected source language code
  const [targetLang, setTargetLang] = useState('es'); // Selected target language code
  const [isTranslating, setIsTranslating] = useState(false); // Loader state while translating
  const [copySuccess, setCopySuccess] = useState(false); // Copy feedback state

  // Get context values with error handling
  const context = useContext(AuthContext);
  const { user, isopen } = context || { user: null, isopen: false };

  // Check premium limits before translation
  const checkPremiumLimits = () => {
    const charLimit = 100; // Free user character limit

    if (!user?.isPremium && sourceText.length > charLimit) {
      // Redirect to payment page instead of showing modal
      navigate('/payment');
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
      <LoginNav/>

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
            {user?.isPremium && (
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
            <span>{user?.isPremium ? 'Unlimited' : 'Free to Use'}</span>
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
                  maxLength={user?.isPremium ? 5000 : 100}
                />

                {/* Character limit indicator */}
                <div className='flex justify-between items-center text-xs text-white/60'>
                  <span>
                    {sourceText.length} / {user?.isPremium ? '5000' : '100'} characters
                  </span>
                  {!user?.isPremium && sourceText.length > 80 && (
                    <button
                      onClick={() => navigate('/payment')}
                      className='text-yellow-400 hover:text-yellow-300 underline'
                    >
                      Upgrade for unlimited
                    </button>
                  )}
                </div>

                {/* Premium limit warning */}
                {!user?.isPremium && sourceText.length > 100 && (
                  <div className='bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-yellow-200 text-sm'>
                    <div className='flex items-center space-x-2'>
                      <Crown className='w-4 h-4' />
                      <span>
                        Character limit reached!
                        <button
                          onClick={() => navigate('/payment')}
                          className='underline hover:text-yellow-100 ml-1'
                        >
                          Upgrade to Premium
                        </button>{' '}
                        for unlimited translations.
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
              {!user?.isPremium && (
                <button
                  onClick={() => navigate('/payment')}
                  className='ml-0 sm:ml-4 mt-2 sm:mt-0 w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base'
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
