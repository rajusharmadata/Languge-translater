import User from '../models/user.model.js';
import { sendEmail } from '../utils/sendEmail.js';
import bcrypt from 'bcrypt';
import { otpTemplate } from '../utils/emailTemplet.js';
import { sendForgotPasswordEmail } from '../utils/forgotPasswordMail.js';
import crypto from 'crypto';

const EmailVerification = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, name and password are required',
      });
    }

    // check if user exists
    let user = await User.findOne({ email });

    if (user && user.isActive) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
      });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // hash OTP
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!user) {
      // create new user
      user = new User({
        email,
        name,
        password: hashedPassword,
        otp: hashedOtp,
        otpExpires,
        isActive: false,
      });
    } else {
      // update OTP for existing inactive user
      user.otp = hashedOtp;
      user.otpExpires = otpExpires;
      user.password = hashedPassword; // optional: update password
    }

    await user.save();

    // send OTP email
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: otpTemplate(email, otp),
    });

    return res.status(201).json({
      success: true,
      message: 'OTP sent to your email. Please verify within 5 minutes.',
    });
  } catch (err) {
    console.error('Email creation error:', err);
    return res.status(500).json({
      success: false,
      message: 'User creation error',
    });
  }
};

const Verifyotp = async (req, res) => {
  const { email, otp } = req.body;
  // validation check
  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: 'Email & OTP are required' });
  }

  const stored = await User.findOne({ email });

  // Check if OTP exists
  if (!stored.otp) {
    return res
      .status(400)
      .json({ success: false, message: 'OTP not found or expired' });
  }
  // console.log(stored.otp);

  // Check expiry
  console.log(stored);
  if (Date.now() > stored.otpExpires) {
    // stored.delete(email);
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }
  const isMatch = await bcrypt.compare(String(otp), stored.otp);
  // Check match
  if (isMatch) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  // ✅ OTP Verified
  stored.otp = undefined;
  stored.isActive = true;
  await stored.save();

  res.json({ success: true, message: 'OTP verified successfully' });
};

const Singin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(409).json({
        success: false,
        message: ' must be all data is required ',
      });
    }
    // cheak user exist aur not
    const existUser = await User.findOne({ email });
    if (!existUser || !existUser.isActive) {
      return res.status(403).json({
        success: false,
        message: 'not a valid user ',
      });
    }

    // check the exist user password match
    const isMatch = await existUser.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'password is wrong ',
      });
    }
    // payload means which data in include in token
    const payload = {
      name: existUser.name,
      email: existUser.email,
      isActive: existUser.isActive,
      isPremium: existUser.isPremium,
      subscriptionEndDate: existUser.subscriptionEndDate,
      planType: existUser.planType,
    };
    // generate token
    const token = await existUser.generatejwToken(payload);
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true if HTTPS
      sameSite: 'lax', // or "none" if frontend/backend on diff domains
    });

    res.status(202).json({
      success: true,
      message: 'successfully Sining',
      Token: token,
      data: {
        name: existUser.name,
        email: existUser.email,
        isActive: existUser.isActive,
        isPremium: existUser.isPremium,
      },
    });
  } catch (error) {
    console.error(`signin error ${error}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const frogotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendForgotPasswordEmail(user.email, resetUrl);
    console.log(user.email);
    console.log(resetUrl);

    res.json({
      message: 'Reset link sent to your email',
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { token } = req.params; // raw token from URL
    const { password } = req.body;

    // Hash the token to match DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with this hashed token and check if not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password (your pre-save hook will hash it)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
};

export {
  EmailVerification,
  Verifyotp,
  Singin,
  logout,
  frogotPassword,
  resetpassword,
};
