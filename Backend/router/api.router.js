import { Router } from 'express';
import { translateController } from '../controller/api.controller.js';
import { EmailVerification, Verifyotp, Singin,verified, logout } from '../controller/user.controller.js';
import { createOrder, verifypayment, checkSubscription } from '../controller/payment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const router = Router();

router.post('/translate', translateController);

router.post('/user', EmailVerification);

// route for the verified user
router.post('/verify', Verifyotp);

// route for the Singin
router.post('/signin', Singin);

// Payment routes
router.post('/create-order', createOrder);
router.post('/verify-payment', verifypayment);

// Optional: Check subscription status
router.get('/subscription/:userId', checkSubscription);

// proteced route
router.get('/translate', authMiddleware, (req, res) => {
  res.json({
    success:true,
    message:'user is valid '
  })
})
// virifyuser route
router.get('/auth', verified);
// logout route
router.post('/logout',logout)

export { router };
