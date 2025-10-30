#!/usr/bin/env node

import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const listLockedAccounts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find users with login attempts or lock status
    const users = await User.find({
      $or: [
        { loginAttempts: { $gt: 0 } },
        { lockUntil: { $exists: true } }
      ]
    }).select('email firstName lastName loginAttempts lockUntil createdAt');

    console.log(`\n📊 Found ${users.length} users with login issues:\n`);

    users.forEach(user => {
      const isLocked = user.lockUntil && user.lockUntil > Date.now();
      console.log(`📧 ${user.email} (${user.firstName} ${user.lastName})`);
      console.log(`   🔢 Login attempts: ${user.loginAttempts || 0}`);
      console.log(`   🔒 Currently locked: ${isLocked ? 'YES' : 'NO'}`);
      
      if (user.lockUntil) {
        const lockDate = new Date(user.lockUntil);
        const now = new Date();
        if (lockDate > now) {
          const minutesLeft = Math.ceil((lockDate - now) / (1000 * 60));
          console.log(`   ⏰ Lock expires in: ${minutesLeft} minutes`);
        } else {
          console.log(`   ⏰ Lock expired: ${lockDate.toLocaleString()}`);
        }
      }
      
      console.log(`   📅 Account created: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    if (users.length === 0) {
      console.log('✅ No locked accounts found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

listLockedAccounts();