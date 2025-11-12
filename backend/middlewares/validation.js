import { z } from "zod";

// Define the schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")
    .trim(),

  email: z.string()
    .email("Invalid email format")
    .trim(),

  password: z.string()
    .min(6, "Password must be at least 6 characters long"),

  phone: z.string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  role: z.enum(["admin", "mediator", "user", "seller"]).optional(),

  upiId: z.string().optional(),
  accountNumber: z.string().optional(),
  accountIfsc: z.string().optional()
});

const orderSchema = z.object({
  product: z.string({ required_error: "Product ID is required" }),

  mediator: z.string({ required_error: "Mediator ID is required" }),

  name: z.string()
    .min(2, "Name must be at least 2 characters long")
    .trim()
    .toLowerCase(),

  email: z.string()
    .email("Invalid email format")
    .trim(),

  phone: z.string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

  orderNumber: z.string()
    .min(1, "Order number is required")
    .trim(),

  orderDate: z.preprocess(
    (val) => (val ? new Date(val) : undefined),
    z.date({ required_error: "Order date is required" })
  ),

  orderAmount: z.number({
    required_error: "Order amount is required",
    invalid_type_error: "Order amount must be a number"
  }),

  lessPrice: z.number({
    required_error: "Less price is required",
    invalid_type_error: "Less price must be a number"
  }),

  oldOrderNumber: z.string().optional(),
  orderSS: z.string().optional(),
  priceBreakupSS: z.string().optional(),

  orderStatus: z.enum(["accepted", "pending", "rejected"]).optional(),

  rejectionMessage: z.string().optional(),
  note: z.string().optional(),
  dealType: z.enum(["original", "exchange" , "empty"]).optional(),
  exchangeProduct: z.string().optional(),
  ratingOrReview: z.enum(["rating", "review" , "only_order", "review_submitted"]).optional(),
  isReplacement: z.enum(["yes", "no"]).optional(),

});
const refundSchema = z.object({
  orderNumber: z.string()
    .min(1, "Order number is required")
    .trim(),
  upiId: z.string()
    .min(1, "UpiId is required")
    .trim(),

  deliveredSS: z.string().optional(),
  reviewSS: z.string().optional(),
  sellerFeedbackSS: z.string().optional(),
});

// Middleware function
export const validateLogin = (req, res, next) => {
  try {
    loginSchema.parse(req.body); // Validate the request body
    next(); // Continue if valid
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors.map((err) => err.message),
    });
  }
};



// Middleware for register validation
export const validateRegister = (req, res, next) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors.map((err) => err.message)
    });
  }
};

// Middleware for Orderform validation 

export const validateOrder = (req, res, next) => {
  try {
    console.log(req.body);
    // Convert numeric fields if they come as strings
    if (req.body.data.orderAmount) req.body.data.orderAmount = Number(req.body.data.orderAmount);
    if (req.body.data.lessPrice) req.body.data.lessPrice = Number(req.body.data.lessPrice);

    orderSchema.parse(req.body.data);

    // console.log("asdlf")
    next();
  } catch (error) {
    console.error("Order validation error:", error);
    
    // Safe error mapping - this is where your error was occurring
    let errorMessages = [];
    if (error.errors && Array.isArray(error.errors)) {
      errorMessages = error.errors.map((err) => err.message);
    } else if (error.message) {
      errorMessages = [error.message];
    } else {
      errorMessages = ["Validation failed"];
    }

    return res.status(400).json({
      success: false,
      message: "Order validation failed",
      errors: errorMessages
    });
  }
};