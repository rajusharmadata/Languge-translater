import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { TbPasswordUser, TbPasswordFingerprint } from 'react-icons/tb';

const Sinin = () => {
  const [formdata, setFormdata] = useState({
    email: '',
    password: '',
  });
  const[showPassowrd,setShowPassword] = useState(false)
  const naviagte = useNavigate();

  const onChangeHandler = event => {
    const { name, value } = event.target;
    setFormdata(prev => {
      return { ...prev, [name]: value };
    });
  };
  // post api
  const axiosHandler = async () => {
    try {
      const response = axios.post('/api/v1//signin', {
        email: formdata.email,
        password: formdata.password,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const submitHandler = event => {
    event.preventDefault(); // page reload nhi hone dega
    console.log(formdata); // cheak
    axiosHandler();
    naviagte('/translate');
  };
 return (
   <div className='h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-800'>
     <div className='w-96 py-10 bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-black/60 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-gray-700/40'>
       <h2 className='text-3xl font-bold text-center text-white mb-6 tracking-wide'>Sign in</h2>
       <form onSubmit={submitHandler} className='space-y-5'>
         {/* Email */}
         <div>
           <label htmlFor='email' className='block text-sm font-medium relative text-gray-300 mb-2'>
             Email Address
             <span className='absolute top-10 left-0.5'>
               <TbPasswordUser size={20} />
             </span>
           </label>
           <input
             type='email'
             id='email'
             name='email'
             placeholder='example@gmail.com'
             value={formdata.email}
             onChange={onChangeHandler}
             className='w-full px-4 pl-6 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
           />
         </div>

         {/* Password */}
         <div className='relative'>
           <label htmlFor='password' className='block text-sm font-medium text-gray-300 mb-2'>
             Password
           </label>
           <input
             type={!showPassowrd ? 'password' : 'text'}
             id='password'
             name='password'
             placeholder='••••••••'
             value={formdata.password}
             onChange={onChangeHandler}
             className='w-full px-4 pl-6 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
           />
           <span
             className='absolute top-10 right-3 text-white cursor-pointer'
             onClick={() => setShowPassword(!showPassowrd)}
           >
             {!showPassowrd ? <HiEye size={18} /> : <HiEyeOff size={18} />}
           </span>
           <span className='absolute top-10 left-0.5  text-white'>
             <TbPasswordFingerprint size={20} />
           </span>
         </div>

         {/* Button */}
         <button className='w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2.5 rounded-lg font-semibold hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 shadow-md'>
           Continue
         </button>
         <p className='text-white pl-15'>
           if you don't have account  <span className = "hover:opacity-70 cursor-pointer text-gray-400" onClick={()=>naviagte('/signup')}>Signup</span>
         </p>
       </form>
     </div>
   </div>
 );

};

export default Sinin;
