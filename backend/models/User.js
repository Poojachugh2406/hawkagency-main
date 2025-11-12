import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Name is required"],
        trim:true,
        lowercase:true,
    },
    nickName:{
        type:String,
        required:false,
        trim:true,
        lowercase:true,
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    phone: {
        type:String,
        required: [true, "Phone Number is required"]
    },
    role: {
        type: String,
        enum : ['admin', 'mediator', 'user' , 'seller'],
        default :'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    upiId:{
        type:String
    },
    accountNumber:{
        type:String
    },
    accountIfsc:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{timestamps:true});


// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
// User Schema Indexes
// userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ role: 1, isActive: 1 });
const User = mongoose.model('User',userSchema);
export default User;