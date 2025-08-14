import React from 'react'
import { Link } from 'react-router-dom'
import { Globe } from 'lucide-react'

const Navbar = () => {
  return (
    <div>
      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              TransLingo
            </h1>
          </div>
          <div className="hidden lg:flex space-x-8">
            <Link
              to="/features"
              className="text-white/80 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-white/80 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-white/80 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              to="/signin"
              className="bg-white text-purple-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign In
            </Link>
          </div>
          <div className="lg:hidden">
            <button className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors">
              Menu
            </button>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default Navbar
