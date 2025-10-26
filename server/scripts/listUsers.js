import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'firstName lastName email learningProfile.interests learningProfile.preferredContentTypes');
    
    console.log(`Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`   Interests: ${user.learningProfile?.interests?.map(i => i.topic).join(', ') || 'None'}`);
      console.log(`   Preferred Content: ${user.learningProfile?.preferredContentTypes?.join(', ') || 'None'}`);
    });

  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

listUsers();