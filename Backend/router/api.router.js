import { Router } from 'express';
import { translateController } from '../controller/api.controller.js';
import { EmailVerification, Verifyotp, Singin, logout } from '../controller/user.controller.js';
import { createOrder, verifypayment, checkSubscription } from '../controller/payment.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/translate', translateController);
router.post('/user', EmailVerification);
router.post('/verify', Verifyotp);
router.post('/signin', Singin);
router.post('/logout', logout);

// Payment routes
router.post('/create-order', createOrder);
router.post('/verify-payment', verifypayment);

// Optional: Check subscription status
router.get('/subscription/:userId', checkSubscription);

// Protected routes
router.get('/me', isAuthenticated, (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user, // this comes from your middleware
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});




export { router };
