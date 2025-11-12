import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Product',
    },
    mediator: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    name:{
        type:String,
        required:[true, "Name is required"],
        trim:true,
        lowercase:true,
    },
    email:{
        type: String,
        required: [true, 'Email is required'],  
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type:String,
        required: [true, "Phone Number is required"]
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    orderAmount: {
        type: Number,
        required: true
    },
    lessPrice: {
        type: Number,
        required:true
    },
    oldOrderNumber: {
        type: String,
        trim: true
    },
    orderSS: {
        type: String, // store URL/path of uploaded screenshot
        trim: true
    },
    priceBreakupSS: {
        type: String, // store URL/path of uploaded price breakup screenshot
        trim: true
    },
    orderStatus:{
        type:String,
        enum:['accepted','pending','rejected','payment_done','refund_placed','refill'],
        default:'pending',
    },
    rejectionMessage:{
        type:String,
    },
    dealType: {
      type: String,
      enum: ["original", "exchange" , "empty"],
      required: true,
    },
    exchangeProduct:{
        type:String,
        required:false,
        trim:true,
    },
    isReplacement: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },
    ratingOrReview: {
      type: String,
      enum: ["rating", "review" , "only_order", "review_submitted"],
      required: true,
    },
    note:{
        type:String
    }
},{timestamps:true});

// orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ product: 1 });
orderSchema.index({ mediator: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderDate: 1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ product: 1, createdAt: -1 });
orderSchema.index({ mediator: 1, createdAt: -1 });

const Order = mongoose.model('Order',orderSchema);
export default Order;