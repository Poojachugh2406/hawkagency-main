import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:false
    },
    name:{
        type:String,
        required:[true, "Product Name is required"],
        trim:true,
        lowercase:true,
    },
    brand:{
        type:String,
        required:[true, "brand Name is required"],
        trim:true,
        lowercase:true,
    },
    productCode:{
        type:String,
        trim:true,
        unique:true// product code should be unique
        
    },
    brandCode:{
        type:String,
        trim:true
    },
    productLink:{
        type:String,
    },
    ratingSlots:{
        type:Number,
        default:0
    },
    reviewSlots:{
        type:Number,
        default:0
    },
    onlyOrderSlots:{
        type:Number,
        default:0
    },
    reviewSubmittedSlots:{
        type:Number,
        default:0
    },
    productPlatform:{
        type:String,
        lowercase:true,
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true});


// productSchema.index({ productCode: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ productPlatform: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ brand: 1, productPlatform: 1 });
const Product = mongoose.model('Product',productSchema);
export default Product;