import mongoose from "mongoose";

const refundSchema = new mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Order',
        required:true,
    },
    upiId:{
        type:String,
    },
    bankInfo:{
        accountNumber:{
            type:String,
        },
        ifscCode:{
            type:String,
        }
    },
    reviewLink:{
        type:String,
    },
    deliveredSS:{
        type:String,
    },
    reviewSS:{
        type:String,
    },
    sellerFeedbackSS:{
        type:String,
    },
    returnWindowSS:{
        type:String,
    },
    status:{
        type:String,
        enum:['accepted', 'rejected', 'pending', 'payment_done' , 'refill'],
        default:'pending'
    },
    rejectionMessage:{
        type:String,
    },
    note:{
        type:String
    },
    isReturnWindowClosed:{
        type:Boolean,
    }
},{timestamps:true});

// Refund Schema Indexes
refundSchema.index({ order: 1 });
refundSchema.index({ status: 1 });
refundSchema.index({ createdAt: -1 });
refundSchema.index({ status: 1, createdAt: -1 });
const Refund = mongoose.model('Refund',refundSchema);
export default Refund;