#!/usr/bin/env node

import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const unlockAccount = async (email) => {
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
    console.log(`🔒 Is locked: ${user.isLocked}`);
    console.log(`🔢 Login attempts: ${user.loginAttempts}`);
    
    if (user.lockUntil) {
      console.log(`⏰ Lock until: ${new Date(user.lockUntil)}`);
    }

    // Reset login attempts and unlock
    await user.resetLoginAttempts();
    
    console.log('✅ Account unlocked successfully');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('Usage: node unlock-account.js <email>');
  console.log('Example: node unlock-account.js user@example.com');
  process.exit(1);
}

unlockAccount(email);