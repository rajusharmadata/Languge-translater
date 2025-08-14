import React from 'react'
import { Globe, Facebook, Twitter, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-400 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo & Name */}
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 " />
          <span className="text-white font-semibold text-lg">
            AI Language Translator
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/feature" className="hover:text-white transition-colors">
            Feature
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-4">
          <a href="#" className="hover:text-blue-400 transition-colors">
            <Facebook size={20} />
          </a>
          <a href="#" className="hover:text-sky-400 transition-colors">
            <Twitter size={20} />
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors">
            <Linkedin size={20} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6  border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} AI Language Translator. All rights
        reserved.
      </div>
    </footer>
  )
}

export default Footer
