import mongoose from 'mongoose';
import User from '../models/User.js';
import Content from '../models/Content.js';
import recommendationService from '../services/recommendationService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function testRecommendations() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if we have users
    const userCount = await User.countDocuments();
    console.log(`Total users: ${userCount}`);

    // Check if we have content
    const contentCount = await Content.countDocuments();
    console.log(`Total content: ${contentCount}`);

    if (userCount === 0) {
      console.log('No users found. Creating a test user...');
      
      const testUser = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'testpassword123',
        learningProfile: {
          interests: [
            { topic: 'javascript', proficiency: 'intermediate', priority: 8 },
            { topic: 'react', proficiency: 'beginner', priority: 7 },
            { topic: 'python', proficiency: 'intermediate', priority: 6 }
          ],
          learningGoals: [
            {
              title: 'Master React Hooks',
              description: 'Learn advanced React patterns and hooks',
              progress: 25
            },
            {
              title: 'Python Data Science',
              description: 'Get proficient with pandas and numpy',
              progress: 10
            }
          ],


          availableTime: {
            dailyMinutes: 60,
            preferredTimes: ['evening']
          }
        },
        behaviorAnalytics: {
          preferredContentDifficulty: 'intermediate',
          averageSessionDuration: 45,
          contentCompletionRate: 0.75
        }
      });

      await testUser.save();
      console.log('✓ Test user created');
    }

    // Get the first user
    const user = await User.findOne();
    console.log(`Testing with user: ${user.email}`);

    // Test trending content (no auth required)
    console.log('\n--- Testing Trending Content ---');
    const trending = await recommendationService.getTrendingWithPersonalization(null, { limit: 3 });
    console.log(`Trending content count: ${trending.length}`);
    trending.forEach((content, index) => {
      console.log(`${index + 1}. ${content.title} (Rating: ${content.consumptionStats?.avgRating || 'N/A'})`);
    });

    // Test personalized recommendations
    console.log('\n--- Testing Personalized Recommendations ---');
    const recommendations = await recommendationService.getPersonalizedRecommendations(user._id.toString(), {
      limit: 5
    });
    console.log(`Personalized recommendations count: ${recommendations.length}`);
    recommendations.forEach((content, index) => {
      console.log(`${index + 1}. ${content.title}`);
      console.log(`   Score: ${content.recommendationScore?.toFixed(3) || 'N/A'}`);
      console.log(`   Reasons: ${content.reasons?.join(', ') || 'None'}`);
      console.log('');
    });

    if (recommendations.length === 0) {
      console.log('No recommendations found. This might be due to:');
      console.log('- User has no embedding generated');
      console.log('- Content embeddings are not compatible');
      console.log('- Similarity threshold is too high');
      
      // Try to generate user embedding
      console.log('\nGenerating user embedding...');
      const embeddingGenerated = await recommendationService.generateUserEmbedding(user._id.toString());
      console.log(`User embedding generated: ${embeddingGenerated}`);
      
      if (embeddingGenerated) {
        console.log('Retrying recommendations...');
        const retryRecommendations = await recommendationService.getPersonalizedRecommendations(user._id.toString(), {
          limit: 5
        });
        console.log(`Retry recommendations count: ${retryRecommendations.length}`);
        retryRecommendations.forEach((content, index) => {
          console.log(`${index + 1}. ${content.title} (Score: ${content.recommendationScore?.toFixed(3) || 'N/A'})`);
        });
      }
    }

  } catch (error) {
    console.error('Error testing recommendations:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testRecommendations();