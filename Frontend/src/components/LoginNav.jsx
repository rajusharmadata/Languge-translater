import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { AuthContext } from '../context/authcontext';

const LoginNav = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // wait for logout to finish
      navigate('/'); // redirect to home
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className={`relative z-10  mb-20`}>
      <nav className='flex justify-between w-full px-5 z-50  h-16 items-center bg-transparent'>
        {/* Logo */}
        <div className='flex items-center space-x-2'>
          <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
            <Globe className='w-4 h-4 sm:w-6 sm:h-6 text-white' />
          </div>
          <Link className='text-xl sm:text-2xl font-bold text-white' to={'/'}>TransLingo</Link>
        </div>

        {/* Avatar + Dropdown */}
        <div className='relative'>
          <div className='h-10 w-10 cursor-pointer' onClick={() => setOpen(prev => !prev)}>
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
              alt='avatar'
              className='object-cover rounded-full h-full w-full border-2 border-white'
            />
          </div>

          {open && (
            <div className='absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg overflow-hidden'>
              <Link
                to='/profile'
                className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer'
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default LoginNav;
