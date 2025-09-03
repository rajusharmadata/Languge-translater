import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setMessage('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
     const response = await axios.post(`/api/v1/reset-password/${token}`, {
       password: password, // make sure this is not empty
     });

      setMessage(response.data.message || 'Password reset successful');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900'>
      <form onSubmit={handleSubmit} className='bg-white p-6 rounded-2xl shadow-md w-96'>
        <h2 className='text-xl font-bold mb-4'>Reset Password</h2>

        {message && <p className='text-red-500 mb-2 text-center'>{message}</p>}

        <input
          type='password'
          placeholder='New Password'
          className='border p-2 w-full mb-2 rounded'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <input
          type='password'
          placeholder='Confirm Password'
          className='border p-2 w-full mb-4 rounded'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <button
          type='submit'
          disabled={loading}
          className='bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 disabled:opacity-50'
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
