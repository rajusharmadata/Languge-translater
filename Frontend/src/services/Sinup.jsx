import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { TbPasswordUser, TbPasswordFingerprint,TbMail } from 'react-icons/tb';
const Signup = () => {
  const [formdata, setFormdata] = useState({
    email: "",
    name: "",
    password:"",
  });
  const [showPassowrd,setShowPassword] = useState(false)
  const naviagte = useNavigate();

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormdata((prev) => {
      return { ...prev, [name]: value };
    })
  };
  // post api
  const axiosHandler = async () => {
    try {
      const response = axios.post('/api/v1/user', {
        name: formdata.name,
        email: formdata.email,
        password: formdata.password,
       });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const submitHandler =  (event) => {
    event.preventDefault();// page reload nhi hone dega
    console.log(formdata);// cheak
    axiosHandler()
    naviagte('/verify');

  }

  return (
    <div className='h-screen flex justify-center items-center bg-gradient-to-br from-black via-purple-900 to-indigo-900'>
      <div className='w-96 py-10 bg-gradient-to-br from-black via-purple-900 to-indigo-900 shadow-lg rounded-2xl p-6'>
        <h2 className='text-2xl font-semibold text-center text-white mb-6'>Sign Up</h2>
        <form onSubmit={submitHandler}>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium relative text-gray-300 mb-2'
            >
              Email Address
              <span className='absolute top-10 left-0.5 px-1.5'>
                <TbMail size={20} />
              </span>
            </label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='example@gmail.com'
              value={formdata.email}
              onChange={onChangeHandler}
              className='w-full px-4 pl-8 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>
          <label htmlFor='name' className='block  relative text-sm font-medium text-gray-100 mb-2'>
            Name
            <span className='absolute top-10 left-0.5 px-1.5'>
              <TbPasswordUser size={20} />
            </span>
          </label>
          <input
            type='text'
            id='name'
            name='name'
            placeholder='johan Don'
            value={formdata.name}
            onChange={onChangeHandler}
            className='w-full px-4 pl-8 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
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
              className='w-full px-4 pl-8 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
            <span
              className='absolute top-10 right-3 text-white cursor-pointer'
              onClick={() => setShowPassword(!showPassowrd)}
            >
              {!showPassowrd ? <HiEye size={18} /> : <HiEyeOff size={18} />}
            </span>
            <span className='absolute top-10 left-0.5 px-1.5  text-white'>
              <TbPasswordFingerprint size={20} />
            </span>
          </div>

          <button className='my-6 w-full bg-blue-600 text-white py-2   rounded-lg hover:bg-blue-700 transition'>
            Continue
          </button>
          <p className='text-white pl-12'>
            {' '}
            if you allredy Account then go to{' '}
            <span
              className='text-gray-300 hover:opacity-70 cursor-pointer'
              onClick={() => naviagte('/signin')}
            >
              Signin
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
