import React from 'react';
import { Check, Crown } from 'lucide-react';

const PricingCard = ({
  plan,
  isSelected,
  onSelect,
  isPremium,
  isProcessing,
  buttonTextOverride,
}) => {
  return (
    <div
      className={`relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border transition-all duration-300 cursor-pointer transform hover:scale-105 ${
        isSelected
          ? 'border-yellow-400 ring-2 ring-yellow-400'
          : 'border-white/20 hover:border-yellow-500/30'
      } ${plan.highlight ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10' : ''}`}
      onClick={() => onSelect(plan.id)}
      role='button'
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(plan.id)}
      aria-label={`Select ${plan.name} plan`}
    >
      {/* Highlight Badge */}
      {plan.highlight && (
        <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
          <span className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg'>
            MOST POPULAR
          </span>
        </div>
      )}

      <h2 className='text-2xl font-bold text-white mb-2'>{plan.name}</h2>
      <div className='text-4xl font-bold text-white mb-1'>{plan.price}</div>
      <span className='text-white/70'>{plan.period}</span>
      {plan.savings && (
        <div className='text-green-400 font-semibold text-lg mt-2'>{plan.savings}</div>
      )}

      <ul className='mt-6 space-y-4 text-left text-white/90'>
        {plan.features.map((feature, i) => (
          <li key={i} className='flex items-start space-x-3'>
            <Check className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0' />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan.id)}
        disabled={isProcessing || isPremium}
        className={`mt-8 w-full font-bold py-3 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 ${
          isSelected
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white'
            : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border border-white/20'
        }`}
        aria-disabled={isProcessing || isPremium}
      >
        {isProcessing ? (
          <div className='flex items-center justify-center space-x-2'>
            <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
            <span>Processing...</span>
          </div>
        ) : isPremium ? (
          <>
            <Crown className='w-5 h-5 inline mr-2' />
            Already Premium
          </>
        ) : (
          buttonTextOverride || plan.button
        )}
      </button>
    </div>
  );
};

export default PricingCard;
