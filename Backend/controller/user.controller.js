import User from '../models/user.model.js';
import { sendEmail } from '../utils/sendEmail.js';
import bcrypt from 'bcrypt';
import { otpTemplate } from '../utils/emailTemplet.js';

const EmailVerification = async (req, res) => {
  const { email ,name,password} = req.body;

  try {
    if (!email ||!name ||!password) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required',
      });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isActive) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
      });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // hash OTP before saving
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    const otpExpires = Date.now() + 5 * 60 * 1000;

    // create user
    const user = new User({
      email,
      name,
      password,
      otp: hashedOtp, // ✅ store hashed otp
      otpExpires,
    });
    const emailTemplet = otpTemplate(otp,email)
    // send OTP email
    await sendEmail(email,  otp);
    // chack the validation again user email is exits
    if (!existingUser) {
    await user.save();
  }

    return res.status(201).json({
      success: true,
      message: 'OTP sent to your email. Please verify within 5 minutes.',
    });
  } catch (err) {
    console.log('email created error ', err);
    res.status(500).json({
      success: false,
      message: 'User creation error',
    });
  }
};
const Verifyotp = async (req, res) => {
  const { email, otp } = req.body;
  // validation check
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email & OTP are required" });
  }

  const stored = await User.findOne({ email });


  // Check if OTP exists
  if (!stored.otp) {
    return res.status(400).json({ success: false, message: "OTP not found or expired" });
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
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  // ✅ OTP Verified
  stored.otp = undefined;
  stored.isActive = true;
  await stored.save()

  res.json({ success: true, message: "OTP verified successfully" });
};

const Singin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(409).json({
        success: false,
        message:" must be all data is required "
    })
    }
    // cheak user exist aur not
    const existUser = await User.findOne({ email });
    if (!existUser || !existUser.isActive) {
      return res.status(403).json({
        success: false,
        message:"not a valid user "
      })
    }

    // check the exist user password match
    const isMatch = await existUser.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message:"password is wrong "
      })
    }
    // payload means which data in include in token
    const payload = {
      name: existUser.name,
      email: existUser.email,
      isActive: existUser.isActive,
    }
    // generate token
    const token = existUser.generatejwToken(payload);
    res.status(202).json({
      success: true,
      message: "successfully Sining",
      Token:token,
      data: {
        name: existUser.name,
        email: existUser.email,
        isActive: existUser.isActive,
      }
    })

  } catch (error) {
    console.error(`signin error ${error}`);
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export { EmailVerification, Verifyotp ,Singin};
