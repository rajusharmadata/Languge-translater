import React from 'react';
import axios from 'axios';

const UpgradeButton = ({ userId, onSuccess }) => {
  const plans = {
    monthly: { price: 299, name: 'Monthly Plan' },
    yearly: { price: 2999, name: 'Yearly Plan' },
  };

  const buyPlan = async planType => {
    try {
      // 1. Create order
      const orderRes = await axios.post('/api/v1/create-order', {
        amount: plans[planType].price,
        userId: userId,
      });

      if (!orderRes.data.success) {
        throw new Error('Failed to create order');
      }

      // 2. Open Razorpay checkout
      const options = {
        key: orderRes.data.keyId,
        amount: orderRes.data.amount,
        currency: 'INR',
        name: 'Language Translator Pro',
        description: plans[planType].name,
        order_id: orderRes.data.orderId,
        handler: async function (response) {
          try {
            // 3. Verify payment
            const verifyRes = await axios.post('/api/v1/verify-payment', {
              ...response,
              userId: userId,
              planType: planType,
            });

            if (verifyRes.data.success) {
              alert('Payment successful! You are now Premium!');
              onSuccess(); // Update parent component
            } else {
              alert('Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function () {
            console.log('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div
      style={{
        textAlign: 'center',
        margin: '20px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ marginBottom: '20px', color: '#333' }}>🚀 Upgrade to Premium</h3>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Unlock unlimited translations and advanced features
      </p>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => buyPlan('monthly')}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '15px 25px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'transform 0.2s',
            minWidth: '150px',
          }}
          onMouseOver={e => (e.target.style.transform = 'scale(1.05)')}
          onMouseOut={e => (e.target.style.transform = 'scale(1)')}
        >
          Monthly
          <br />
          ₹299
        </button>

        <button
          onClick={() => buyPlan('yearly')}
          style={{
            backgroundColor: '#2196F3',
            color: 'white',
            padding: '15px 25px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'transform 0.2s',
            minWidth: '150px',
            position: 'relative',
          }}
          onMouseOver={e => (e.target.style.transform = 'scale(1.05)')}
          onMouseOut={e => (e.target.style.transform = 'scale(1)')}
        >
          <span
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#ff4444',
              color: 'white',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '10px',
            }}
          >
            SAVE ₹589
          </span>
          Yearly
          <br />
          ₹2999
        </button>
      </div>

      <p
        style={{
          marginTop: '15px',
          fontSize: '12px',
          color: '#888',
        }}
      >
        🔒 Secure payment • Cancel anytime
      </p>
    </div>
  );
};

export default UpgradeButton;
