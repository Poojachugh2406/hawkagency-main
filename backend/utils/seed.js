import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create admin user
    const adminUser = new User({
      email: process.env.ADMIN_EMAIL || 'admin@brandboosters.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      phone:'9090909090',
      name: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created successfully');


    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();