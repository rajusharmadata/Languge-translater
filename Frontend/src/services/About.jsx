import React from 'react'
import { Globe, Zap, Shield, Users } from 'lucide-react'
import Footer from './Footer'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">About Our Translator</h1>
        <p className="text-lg text-gray-300 mb-12">
          Our AI-powered language translator helps you break down language
          barriers instantly. Whether you’re traveling, collaborating with a
          global team, or learning a new language, we make communication
          effortless and secure.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <Globe className="w-10 h-10 text-blue-400 mb-4 mx-auto" />
            <h2 className="text-xl font-semibold mb-2">Global Reach</h2>
            <p className="text-gray-400">
              Translate between 120+ languages with exceptional accuracy.
            </p>
          </div>

          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <Zap className="w-10 h-10 text-yellow-400 mb-4 mx-auto" />
            <h2 className="text-xl font-semibold mb-2">Lightning Fast</h2>
            <p className="text-gray-400">
              Get instant translations powered by cutting-edge AI technology.
            </p>
          </div>

          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <Shield className="w-10 h-10 text-green-400 mb-4 mx-auto" />
            <h2 className="text-xl font-semibold mb-2">Privacy First</h2>
            <p className="text-gray-400">
              Your text is never stored. Complete privacy is guaranteed.
            </p>
          </div>

          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <Users className="w-10 h-10 text-pink-400 mb-4 mx-auto" />
            <h2 className="text-xl font-semibold mb-2">Collaboration Ready</h2>
            <p className="text-gray-400">
              Share translations with your team and work together seamlessly.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <p className="text-gray-400">
            Built with ❤️ for people who believe language should never be a
            barrier.
          </p>
              </div>
              <div className='mt-10'>
                  <Footer/>
        </div>
      </div>
    </div>
  )
}

export default About
