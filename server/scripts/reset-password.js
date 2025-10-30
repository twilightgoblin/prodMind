#!/usr/bin/env node

import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const resetPassword = async (email, newPassword) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log(`📧 User found: ${user.email}`);
    console.log(`👤 Name: ${user.firstName} ${user.lastName}`);

    // Reset password
    user.password = newPassword;
    await user.save();
    
    console.log('✅ Password reset successfully');
    console.log(`🔑 New password: ${newPassword}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Get email and password from command line arguments
const email = process.argv[2];
const newPassword = process.argv[3] || 'Test123!';

if (!email) {
  console.log('Usage: node reset-password.js <email> [password]');
  console.log('Example: node reset-password.js user@example.com Test123!');
  console.log('Default password: Test123!');
  process.exit(1);
}

resetPassword(email, newPassword);