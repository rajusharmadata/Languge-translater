import React, { useState, useRef } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
const VerifyOtp = () => {
  const navigate = useNavigate()
  // 6 box  for the store the otp on this box
  const [otp, setOtp] = useState(new Array(6).fill(''));
  // for the refrense
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    // tracking the right value user  enter like only otp is number not any thing you enter it is not consider it
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      //it working for the next box focusing
      if (value !== '' && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };
// backspace
  const handleKeyDown = (e, index) => {
    // cheacking the backspace and cheacking the index of the otp array
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // changing the focus of the input box
      inputRefs.current[index - 1].focus();
    }
  };
  console.log(otp);
  // send the virifcation code on backend and verify the user is verifed user
  const axiosHandler = async ()=>{
    try {
      const res = await axios.post('/api/v1/verify', {
      email:"rajusharmadata123@gmail.com",
      otp
      })
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = e => {
    e.preventDefault();
    // alert('Entered OTP: ' + otp.join(''));
    axiosHandler();
    navigate('/signin');
  };

  const isOtpfiled = otp.every((digit) =>
   digit!==''
  )

  return (
    <div className='h-screen flex justify-center items-center bg-gradient-to-br from-black via-purple-900 to-indigo-900'>
      <div className='bg-gray-900/70 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-700'>
        <h2 className='text-2xl font-bold text-center text-white mb-6'>Verify OTP</h2>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex justify-between gap-3'>
            {otp.map((digit, index) => (
              <input
                key={index}
                type='text'
                value={digit}
                maxLength='1'
                // tracking the element reference
                ref={el => (inputRefs.current[index] = el)}
                // onChange event for the
                onChange={e => handleChange(e.target.value, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                className='w-12 h-12 text-center text-xl font-semibold rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none'
              />
            ))}
          </div>

          <button
            type='submit'
            disabled={!isOtpfiled}
            className={
              isOtpfiled
                ? `w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2.5 rounded-lg font-semibold hover:from-indigo-500 hover:to-blue-500 transition-all duration-300`
                : 'opacity-50 w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2.5 rounded-lg font-semibold hover:from-indigo-500 transition-all duration-300'
            }
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
