import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';

// importing routers 
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/order.js';
import refundRoutes from './routes/refund.js';
import adminRoutes from './routes/admin.js';
import mediatorRoutes from './routes/mediator.js';
import productRoutes from './routes/product.js';
import sellerRoutes from './routes/seller.js';
import userRoutes from './routes/user.js';
import trackRoutes from './routes/track.js';
import connectDB from './config/database.js';
import { generalLimiter } from './middlewares/rateLimiter.js';

// Load environment variables
dotenv.config();


connectDB();
const app = express();

app.set('trust proxy', 1);
// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://brandboostersapp.vercel.app'] 
    : ['https://brandboostersapp.vercel.app', 'http://localhost:5173' , 'http://localhost:4173'],
  credentials: true
}));

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware with increased timeout for file uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Compression middleware
app.use(compression()); 

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});


// Set server timeout for file uploads
app.use((req, res, next) => {
  // Set timeout to 2 minutes for file upload routes
  if (req.path.includes('/create-refund') || req.path.includes('/update-refund')) {
    req.setTimeout(120000); // 2 minutes
    res.setTimeout(120000); // 2 minutes
  }
  next();
});


// API routes
app.use('/api/auth', authRoutes);

app.use('/api/order', orderRoutes);
app.use('/api/refund', refundRoutes);
app.use('/api/track', trackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/product', productRoutes);
// --------------------------------
app.use('/api/mediator',mediatorRoutes)
app.use('/api/user', userRoutes);
app.use('/api/seller',sellerRoutes)




// 404 handler
app.use('/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 5MB.'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field.'
    });
  }
  console.log(err);
  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});


// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});