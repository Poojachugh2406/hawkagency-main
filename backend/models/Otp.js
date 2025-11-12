import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresIn: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
  }
}, { timestamps: true });

// Automatically delete OTP document after expiry
otpSchema.index({ expiresIn: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Otp", otpSchema);
