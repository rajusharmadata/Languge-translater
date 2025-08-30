import React from 'react'
import plans from '../db/Plans'
import { useNavigate } from 'react-router-dom'
import { FaArrowUpRightFromSquare } from "react-icons/fa6";


const Price = () => {
  const navigate = useNavigate();


  return (
    <div className='  text-white px-6 py-5'>
      {/* Page Header */}
      <div className='max-w-4xl mx-auto text-center mb-12'>
        <h1 className='text-4xl font-bold mb-4'>Pricing Plans</h1>
        <p className='text-lg text-gray-300'>
          Choose the plan that fits your needs — whether you’re an individual or a global team.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-2xl p-6 shadow-lg text-center transition-transform transform hover:scale-105 ${
              plan.highlight
                ? 'bg-gradient-to-b from-gray-700 to-gray-900 border border-blue-500'
                : 'bg-gradient-to-b from-gray-800 to-gray-900'
            }`}
          >
            <h2 className='text-2xl font-bold mb-2'>{plan.name}</h2>
            <p className='text-4xl font-bold mb-1'>{plan.price}</p>
            <span className='text-gray-400'>{plan.period}</span>

            <ul className='mt-6 space-y-2 text-gray-300'>
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>

            <button
              onClick={ ()=>navigate('/signin?redirect_url=/translate')}
              className={`mt-8 px-6 py-2 rounded-full font-semibold transition-colors ${
                plan.highlight
                  ? 'bg-gray-700 text-white hover:bg-gray-800'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>

      {/* Closing Line */}
      <div className='mt-16 text-center text-gray-400'>
        Flexible pricing to help you communicate without limits.
      </div>
    </div>
  );
}

export default Price
