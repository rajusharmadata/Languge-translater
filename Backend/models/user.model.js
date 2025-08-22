import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      unique: true, // ✅ good practice
    },
    name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      minLength: 8,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      required:true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10); // Await the hash
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err); // pass error to mongoose
  }
});

// ✅ Compare password method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
// ✅ generate jwt token
userSchema.methods.generatejwToken = async function (payload) {
  try {
    return  await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
  } catch (err) {
    console.log(`token generate error ${err}`);
  }
}
const User = mongoose.model('User', userSchema);
export default User;
