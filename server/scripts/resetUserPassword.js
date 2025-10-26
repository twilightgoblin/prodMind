import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update test user password
    const user = await User.findOne({ email: 'test@example.com' });
    if (user) {
      user.password = 'testpassword123';
      await user.save(); // This will trigger the pre-save hook to hash the password
      console.log('✓ Password updated for test@example.com');
    } else {
      console.log('Test user not found');
    }

    // Also update the other user
    const user2 = await User.findOne({ email: 'okay@gmail.com' });
    if (user2) {
      user2.password = 'password123';
      await user2.save();
      console.log('✓ Password updated for okay@gmail.com');
    }

  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetPassword();