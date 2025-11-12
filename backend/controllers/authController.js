import { generateToken } from "../middlewares/auth.js";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { generateOTP, saveOTP, sendOTPEmail } from "../services/otpService.js";

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password , role } = req.body;
    
    if(!email || !password || !role){
      return res.status(400).json({
        success:false,
        message:'Email , password and role are required'
      });
    }

    // Check for user
    const user = await User.findOne({ email}).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Wrong email or Password'
      });
    }


    if(user.role ==='user' ){
       if(role ==='mediator' || role ==='seller' || role ==='admin'){
         return res.status(401).json({
           success:false,
           message:'Not Authorized to Login this dashboard'
         })
       }
    };

    if(user.role ==='mediator'){
      if(role === 'admin' || role ==='seller'){
        return res.status(401).json({
          success:false,
          message:'Not Authorized to Login this dashboard'
        })
      }
    }
    if(user.role ==='seller'){
      if(role === 'admin' || role ==='mediator'){
        return res.status(401).json({
          success:false,
          message:'Not Authorized to Login this dashboard'
        })
      }
    }

    if(user.role ==='admin'){
      if(role === 'seller' || role ==='mediator'){
        return res.status(401).json({
          success:false,
          message:'Not Authorized to Login this dashboard'
        })
      }
    }

    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Wrong Email or Password'
      });
    }
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    if (!user.isVerified) {

      if(user.role==='user'){
        return res.status(401).json({
          success: false,
          message: 'Account is not Verified'
        });
      }else {
        return res.status(401).json({
          success: false,
          message: 'Wait for Admin to Approve Your Account'
        });
      }
    }

    // Update last login
    user.lastLogin = new Date();
    
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          phone:user.phone,
          name:user.name,
          lastLogin: user.lastLogin,
          upiId:user.upiId || "",
          accountNumber:user.accountNumber || "", 
          accountIfsc:user.accountIfsc|| ""
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};


// @desc Register User
  // @route POST /api/auth/register
// @type Public
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'user', nickName } = req.body;

    // Check for required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and password are required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() }
      ]
    });
    
    if(existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    } 


    // Create new user
    const userData = {
      name: name.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: password,
      role: role,
      nickName: nickName?.trim() || ''
    };

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    // Generate and send verification OTP
    if(role ==='user'){
      const otp = generateOTP();
      await saveOTP(email.toLowerCase(), otp);
      await sendOTPEmail(email.toLowerCase(), otp, 'verification');

      res.status(201).json({
        success: true,
        message: 'User created successfully. Please check your email for verification OTP',
        data: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
          contactInfo: savedUser.phone,
          isVerified: savedUser.isVerified
        }
      });
    }else{
      res.status(201).json({
        success: true,
        message: `${role.toUpperCase()} created successfully. Wait for Admin to verify your account`,
        data: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
          contactInfo: savedUser.phone,
          isVerified: savedUser.isVerified
        }
      });
    }

  } catch (err) {
    console.error('Registration error:', err);

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email or phone already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name:user.name,
        phone:user.phone,
        email: user.email,
        role: user.role,
        upiId:user.upiId,
        accountNumber :user.accountNumber,
        accountIfsc: user.accountIfsc,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error occured'
    });
  }
};


// @desc    Verify user account with OTP
// @route   POST /api/auth/verify
// @access  Public
export const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if email and OTP are provided
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find the latest OTP for the email
    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    // Check if OTP has expired
    if (otpRecord.expiresIn < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Find user and update verification status
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if(user.role !== 'user'){
      return res.status(404).json({
        success: false,
        message: 'only User can verify'
      });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified'
      });
    }

    // Update user verification status
    user.isVerified = true;
    await user.save();

    // Delete the used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: 'Account verified successfully',
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
};

// @desc    Resend verification OTP
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if(user.role !=='user'){
      return res.status(404).json({
        success:false,
        message:"only user can resend verification"
      })
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified'
      });
    }

    const otp = generateOTP();
    await saveOTP(email, otp);
    await sendOTPEmail(email, otp, 'verification');

    res.status(200).json({
      success: true,
      message: 'Verification OTP sent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resending verification'
    });
  }
};


// @desc    Send password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset OTP has been sent'
      });
    }

    // Check if user is active and verified
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Account is not verified. Please verify your account first.'
      });
    }

    const otp = generateOTP();
    await saveOTP(email, otp);
    await sendOTPEmail(email, otp, 'password_reset');

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent successfully'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Find the latest OTP for the email
    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    // Check if OTP has expired
    if (otpRecord.expiresIn < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Delete the used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
};

// @desc    Change password (for authenticated users)
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name:user.name,
          nickName:user.nickName,
          phone:user.phone,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          upiId:user.upiId,
          accountNumber:user.accountNumber,
          accountIfsc:user.accountIfsc,
        }
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const updateData = req.body;

    // Prevent updating email and role through this endpoint
    if (updateData.email || updateData.role || updateData.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email , role and verification cannot be updated'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { 
        new: true,
        runValidators: true 
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name:user.name,
          nickName:user.nickName??"N/A",
          phone:user.phone,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          upiId:user.upiId,
          accountNumber:user.accountNumber,
          accountIfsc:user.accountIfsc,
        }
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};



