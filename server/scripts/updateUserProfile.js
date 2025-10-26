import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function updateUserProfile() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all users to have compatible preferences
    const result = await User.updateMany(
      {},
      {
        $set: {
          'learningProfile.preferredContentTypes': ['video'],
          'learningProfile.interests': [
            { topic: 'javascript', proficiency: 'intermediate', priority: 8 },
            { topic: 'react', proficiency: 'beginner', priority: 7 },
            { topic: 'python', proficiency: 'intermediate', priority: 6 },
            { topic: 'programming', proficiency: 'intermediate', priority: 9 }
          ],
          'learningProfile.learningGoals': [
            {
              title: 'Master JavaScript',
              description: 'Learn advanced JavaScript concepts and patterns',
              progress: 25
            },
            {
              title: 'React Development',
              description: 'Build modern React applications',
              progress: 10
            }
          ]
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} users`);

  } catch (error) {
    console.error('Error updating user profiles:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateUserProfile();