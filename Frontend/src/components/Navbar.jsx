import React, { useContext  } from 'react'
import { Link } from 'react-router-dom'
import { Globe,  } from 'lucide-react'
import { CiMenuFries } from 'react-icons/ci'
import { IoMdClose } from 'react-icons/io'
import { AppContext } from '../context/App'


const Navbar = () => {
  const { isopen, setIsOpen } = useContext(AppContext)


  return (
    <div>
      {/* Header */}
      <header className='`relative z-10 p-4 sm:p-6 '>
        <nav className='flex justify-between w-screen  max-sm:px-2 px-5 fixed top-0 left-0 z-50 shadow-2xl h-16 items-center'>
          <div className='flex items-center space-x-2 '>
            <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
              <Globe className='w-4 h-4 sm:w-6 sm:h-6 text-white' />
            </div>
            <h1 className='text-xl sm:text-2xl font-bold text-white'>TransLingo</h1>
          </div>
          <div className='hidden lg:flex space-x-8'>
            <a href='#price' className='text-white py-1.5 hover:text-white transition-colors'>
              Pricing
            </a>
            <a href='#about' className='text-white py-1.5 hover:text-white transition-colors'>
              About
            </a>

            <Link
              to='/signin'
              className=' text-white px-2  py-1.5 font-semibold flex  items-center justify-center transition-colors  hover:bg-gray-800 rounded-sm  '
            >
              Sing in
            </Link>
          </div>
          {/* mobile view  */}
          <div className='lg:hidden'>
            {/* Toggle Button */}
            {!isopen ? (
              <button
                className='text-white px-4 py-2 rounded-full text-sm font-semibold  transition-colors cursor-pointer'
                onClick={() => setIsOpen(true)}
              >
                <CiMenuFries size={20} className='cursor-pointer' />
              </button>
            ) : (
              <div></div>
            )}

            {/* Overlay + Sliding Menu */}
            <div
              className={`fixed inset-0 z-50 transform ${
                isopen ? 'translate-x-0' : '-translate-x-full'
              } transition-transform duration-300 ease-in-out`}
            >
              {/* Background overlay */}
              <div
                className='absolute inset-0 bg-black/50'
                // onClick={() => setIsOpen(false)}
              ></div>

              {/* Side Menu */}
              <div className='relative w-64 h-full text-white bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 space-y-4'>
                <div className='flex justify-between'>
                  <h1 className='font-bold text-3xl' >TransLingo</h1>
                  <button className='cursor-pointer' onClick={() => setIsOpen(!isopen)}>
                    <IoMdClose size={18} className='  border border-gray-500 rounded-sm ml-10 ' />
                  </button>
                </div>
                <div className='flex flex-col justify-center gap-3'>
                  <a
                    href='#price'
                    className='w-full bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-gray-500 hover:via-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300 cursor-pointer'
                    onClick={() => setIsOpen(false)}
                  >
                    Pricing
                  </a>
                  <a
                    href='#about'
                    className='w-full bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-gray-500 hover:via-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300 cursor-pointer'
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </a>
                  <button
                    className=' className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300  cursor-pointer'
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to='/signin'>Sign In</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar
