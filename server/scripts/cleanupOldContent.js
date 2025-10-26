import mongoose from 'mongoose';
import Content from '../models/Content.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function cleanupOldContent() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Remove old sample content (non-real YouTube videos)
    const result = await Content.deleteMany({
      contentId: { $regex: /^yt_(?!real_)/ } // Remove content that starts with 'yt_' but not 'yt_real_'
    });

    console.log(`Removed ${result.deletedCount} old sample content items`);

    // List remaining content
    const remainingContent = await Content.find({}, 'contentId title source').lean();
    console.log(`\nRemaining content (${remainingContent.length} items):`);
    remainingContent.forEach((content, index) => {
      console.log(`${index + 1}. ${content.title} (${content.contentId})`);
    });

  } catch (error) {
    console.error('Error cleaning up content:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

cleanupOldContent();