import React, { useState } from 'react'
import languages from '../db/languages'
import Navbar from '../components/Navbar'
import FeatureCard from '../components/FeatureCard'

// lucide react-icons
import {
  ArrowRightLeft,
  Volume2,
  Copy,
  Star,

} from 'lucide-react'


const Home = () => {
  // State variables for managing text and settings
  const [sourceText, setSourceText] = useState('') // User input text
  const [translatedText, setTranslatedText] = useState('') // Resulting translated text
  const [sourceLang, setSourceLang] = useState('en') // Selected source language code
  const [targetLang, setTargetLang] = useState('es') // Selected target language code
  const [isTranslating, setIsTranslating] = useState(false) // Loader state while translating



  // Handle translation (Mock API simulation for now)
  const handleTranslate = async () => {
    if (!sourceText.trim()) return // Prevent empty translations

    setIsTranslating(true) // Show loader
    setTimeout(() => {
      // Mock translations for demo purpose
      const mockTranslations = {
        Hello: { es: 'Hola', fr: 'Bonjour', de: 'Hallo', it: 'Ciao' },
        'Good morning': {
          es: 'Buenos días',
          fr: 'Bonjour',
          de: 'Guten Morgen',
          it: 'Buongiorno',
        },
        'Thank you': { es: 'Gracias', fr: 'Merci', de: 'Danke', it: 'Grazie' },
      }

      // Select translation or fallback to default format
      const translation =
        mockTranslations[sourceText]?.[targetLang] ||
        `[Translated to ${
          languages.find(l => l.code === targetLang)?.name
        }]: ${sourceText}`

      setTranslatedText(translation) // Save translated text
      setIsTranslating(false) // Hide loader
    }, 1000)
  }

  // Swap source and target languages
  const swapLanguages = () => {
    const temp = sourceLang
    setSourceLang(targetLang)
    setTargetLang(temp)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  // Copy text to clipboard
  const copyToClipboard = text => {
    // pre defeained javascript method
    navigator.clipboard.writeText(text)
  }

  // Play audio pronunciation of text
  const playAudio = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 rounded-full bg-white/5 animate-pulse"></div>
        <div className="absolute top-20 sm:top-40 -left-10 sm:-left-20 w-30 sm:w-60 h-30 sm:h-60 rounded-full bg-gray-500/10 animate-bounce"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-gray-400/10 animate-ping"></div>
      </div>

      {/* Navbar component */}
      <Navbar />

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
            Break Language
            <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent block sm:inline">
              {' '}
              Barriers
            </span>
          </h2>
          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Translate text instantly with AI-powered precision. Connect with the
            world in over 120 languages.
          </p>
          {/* Rating and Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-white/60 text-sm sm:text-base">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
              <span>4.9 Rating</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>10M+ Translations</span>
            <span className="hidden sm:inline">•</span>
            <span>Free to Use</span>
          </div>
        </div>

        {/* Translation Interface */}
        <div className="max-w-4xl mx-auto px-2 sm:px-0">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
            {/* Language Selectors */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
              {/* Source Language Dropdown */}
              <select
                value={sourceLang}
                onChange={e => setSourceLang(e.target.value)}
                className="w-full sm:w-auto bg-white/10 text-white border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
              >
                {languages.map(lang => (
                  <option
                    key={lang.code}
                    value={lang.code}
                    className="text-gray-900"
                  >
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>

              {/* Swap Button  it is using for the swap the language */}
              <button
                onClick={swapLanguages}
                className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors group order-last sm:order-none"
              >
                <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {/* Target Language Dropdown */}
              <select
                value={targetLang}
                onChange={e => setTargetLang(e.target.value)}
                className="w-full sm:w-auto bg-white/10 text-white border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
              >
                {languages.map(lang => (
                  <option
                    key={lang.code}
                    value={lang.code}
                    className="text-gray-900"
                  >
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Input & Output */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Source Text Area */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-white/80 font-medium text-sm sm:text-base">
                    Enter text
                  </label>
                  {sourceText && (
                    <button
                      onClick={() => playAudio(sourceText, sourceLang)}
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                    >
                      <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                    </button>
                  )}
                </div>
                <textarea
                  value={sourceText}
                  onChange={e => setSourceText(e.target.value)}
                  placeholder="Type or paste text here..."
                  className="w-full h-24 sm:h-32 bg-white/5 border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none text-sm sm:text-base"
                />
              </div>

              {/* Translated Text Display */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-white/80 font-medium text-sm sm:text-base">
                    Translation
                  </label>
                  {translatedText && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => playAudio(translatedText, targetLang)}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                      >
                        <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(translatedText)}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="w-full h-24 sm:h-32 bg-white/5 border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white overflow-y-auto text-sm sm:text-base">
                  {isTranslating ? (
                    // Translation loading animation
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <span className="text-white/60 text-xs sm:text-sm">
                        Translating...
                      </span>
                    </div>
                  ) : (
                    translatedText || (
                      <span className="text-white/40">
                        Translation will appear here...
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Translate Button */}
            <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={handleTranslate}
                disabled={!sourceText.trim() || isTranslating}
                className="w-full sm:w-auto bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base border border-white/20"
              >
                {isTranslating ? 'Translating...' : 'Translate'}
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
       <FeatureCard/>
      </main>
    </div>
  )
}

export default Home
