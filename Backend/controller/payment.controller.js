import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/user.model.js';

// Create Order Function
export const createOrder = async (req, res) => {
  // Initialize Razorpay with your keys
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  try {
    const { amount, userId } = req.body;

    // Verify user exists and is active
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first',
      });
    }

    // Create order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${userId.substring(0, 6)}_${Date.now()}`, // <= 40 chars,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
    });
  }
};

// Verify Payment Function
export const verifypayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      planType,
    } = req.body;

    // Create signature for verification
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac(
        'sha256',
        process.env.RAZORPAY_KEY_SECRET || 'your_secret_key'
      )
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment verified successfully

      // Calculate subscription end date
      const endDate = new Date();
      if (planType === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (planType === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      // Update user to premium using your existing model structure
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          isPremium: true,
          subscriptionEndDate: endDate,
          planType: planType,
        },
        { new: true }
      );

      // Remove sensitive data before sending response
      const userResponse = {
        _id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        isPremium: updatedUser.isPremium,
        subscriptionEndDate: updatedUser.subscriptionEndDate,
        planType: updatedUser.planType,
        isActive: updatedUser.isActive,
      };

      res.json({
        success: true,
        message: 'Payment verified and subscription activated',
        user: userResponse,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
    });
  }
};

// Check Subscription Status Function (optional)
export const checkSubscription = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if subscription is expired
    let isPremium = user.isPremium;
    if (user.subscriptionEndDate && user.subscriptionEndDate < new Date()) {
      // Subscription expired, update user
      await User.findByIdAndUpdate(userId, { isPremium: false });
      isPremium = false;
    }

    res.json({
      success: true,
      isPremium: isPremium,
      subscriptionEndDate: user.subscriptionEndDate,
      planType: user.planType,
    });
  } catch (error) {
    console.error('Check subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check subscription',
    });
  }
};
