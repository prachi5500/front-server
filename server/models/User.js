import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // For Forgot Password
  // resetToken: String,
  // resetTokenExpiry: Date,
   resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Number, default: null }
 
}, { timestamps: true });

export default mongoose.model('User', userSchema);
