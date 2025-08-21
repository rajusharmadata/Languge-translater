import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const Signup = () => {
  const [formdata, setFormdata] = useState({
    email: "",
    name: "",
    password:"",
  });
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
    naviagte('/varific')

  }

  return (
    <div className='h-screen flex justify-center items-center bg-gradient-to-br from-black via-gray-900 to-gray-800'>
      <div className='w-96 py-10 bg-gradient-to-br from-black via-gray-900 to-gray-800 shadow-lg rounded-2xl p-6'>
        <h2 className='text-2xl font-semibold text-center text-white mb-6'>Sign Up</h2>
        <form onSubmit={submitHandler}>
          <label htmlFor='email' className='block text-sm font-medium text-gray-100 mb-2'>
            Email Address
          </label>
          <input
            type='email'
            id='email'
            name='email'
            placeholder='example@gmail.com'
            value={formdata.email}
            onChange={onChangeHandler}
            className='w-full px-3 py-2 border border-gray-300 outline-none transition text-white'
          />
          <label htmlFor='name' className='block text-sm font-medium text-gray-100 mb-2'>
            Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            placeholder='johan Don'
            value={formdata.name}
            onChange={onChangeHandler}
            className='w-full px-3 py-2 border border-gray-300 outline-none transition text-white'
          />
          <label htmlFor='password' className='block text-sm font-medium text-gray-100 mb-2'>
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            placeholder='password'
            value={formdata.password}
            onChange={onChangeHandler}
            className='w-full px-3 py-2 border border-gray-300 outline-none transition text-white'
          />

          <button className='my-6 w-full bg-blue-600 text-white py-2   rounded-lg hover:bg-blue-700 transition'>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
