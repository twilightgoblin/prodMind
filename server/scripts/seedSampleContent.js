import mongoose from 'mongoose';
import Content from '../models/Content.js';
import embeddingUtils from '../utils/embeddingUtils.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleContent = [
  {
    contentId: 'yt_javascript_basics_001',
    title: 'JavaScript Fundamentals for Beginners',
    description: 'Learn the basics of JavaScript programming including variables, functions, and control structures.',
    source: 'youtube',
    url: 'https://youtube.com/watch?v=PkZNo7MFNFg',
    thumbnail: 'https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg',
    metadata: {
      durationSec: 1800, // 30 minutes
      lengthCategory: 'medium',
      tags: ['javascript', 'programming', 'beginner', 'web development'],
      publishedAt: new Date('2024-01-15'),
      difficulty: 'beginner',
      category: 'programming',
      language: 'en',
      keyTopics: ['variables', 'functions', 'loops', 'conditionals']
    },
    consumptionStats: {
      views: 150,
      avgRating: 4.2,
      completionRate: 0.85,
      totalRatings: 45
    },
    aiAnalysis: {
      summary: 'Comprehensive introduction to JavaScript covering essential programming concepts.',
      keyPoints: [
        'Understanding variables and data types',
        'Writing and calling functions',
        'Using loops and conditional statements',
        'Basic DOM manipulation'
      ],
      learningObjectives: [
        'Write basic JavaScript programs',
        'Understand fundamental programming concepts',
        'Manipulate web page elements'
      ],
      estimatedLearningTime: 45,
      complexityScore: 3
    }
  },
  {
    contentId: 'yt_react_hooks_002',
    title: 'React Hooks Deep Dive',
    description: 'Advanced React concepts focusing on hooks like useState, useEffect, and custom hooks.',
    source: 'youtube',
    url: 'https://youtube.com/watch?v=O6P86uwfdR0',
    thumbnail: 'https://img.youtube.com/vi/O6P86uwfdR0/maxresdefault.jpg',
    metadata: {
      durationSec: 2700, // 45 minutes
      lengthCategory: 'long',
      tags: ['react', 'hooks', 'javascript', 'frontend', 'advanced'],
      publishedAt: new Date('2024-02-01'),
      difficulty: 'advanced',
      category: 'programming',
      language: 'en',
      keyTopics: ['useState', 'useEffect', 'custom hooks', 'react patterns']
    },
    consumptionStats: {
      views: 89,
      avgRating: 4.7,
      completionRate: 0.72,
      totalRatings: 23
    },
    aiAnalysis: {
      summary: 'In-depth exploration of React hooks and advanced patterns for state management.',
      keyPoints: [
        'Mastering useState and useEffect',
        'Creating custom hooks',
        'Performance optimization with hooks',
        'Common hook patterns and pitfalls'
      ],
      learningObjectives: [
        'Build complex React applications with hooks',
        'Create reusable custom hooks',
        'Optimize React performance'
      ],
      estimatedLearningTime: 60,
      complexityScore: 8
    }
  },
  {
    contentId: 'yt_python_data_003',
    title: 'Python for Data Science',
    description: 'Introduction to using Python for data analysis with pandas, numpy, and matplotlib.',
    source: 'youtube',
    url: 'https://youtube.com/watch?v=sample3',
    thumbnail: 'https://img.youtube.com/vi/sample3/maxresdefault.jpg',
    metadata: {
      durationSec: 3600, // 60 minutes
      lengthCategory: 'long',
      tags: ['python', 'data science', 'pandas', 'numpy', 'matplotlib'],
      publishedAt: new Date('2024-01-20'),
      difficulty: 'intermediate',
      category: 'programming',
      language: 'en',
      keyTopics: ['data analysis', 'visualization', 'pandas', 'numpy']
    },
    consumptionStats: {
      views: 234,
      avgRating: 4.5,
      completionRate: 0.68,
      totalRatings: 67
    },
    aiAnalysis: {
      summary: 'Comprehensive guide to Python data science libraries and techniques.',
      keyPoints: [
        'Data manipulation with pandas',
        'Numerical computing with numpy',
        'Data visualization with matplotlib',
        'Real-world data analysis examples'
      ],
      learningObjectives: [
        'Analyze datasets using Python',
        'Create data visualizations',
        'Apply statistical methods'
      ],
      estimatedLearningTime: 90,
      complexityScore: 6
    }
  },
  {
    contentId: 'yt_productivity_004',
    title: 'Time Management for Developers',
    description: 'Effective time management strategies and productivity techniques for software developers.',
    source: 'youtube',
    url: 'https://youtube.com/watch?v=sample4',
    thumbnail: 'https://img.youtube.com/vi/sample4/maxresdefault.jpg',
    metadata: {
      durationSec: 1200, // 20 minutes
      lengthCategory: 'short',
      tags: ['productivity', 'time management', 'developer', 'career'],
      publishedAt: new Date('2024-02-10'),
      difficulty: 'beginner',
      category: 'productivity',
      language: 'en',
      keyTopics: ['time blocking', 'pomodoro technique', 'focus', 'planning']
    },
    consumptionStats: {
      views: 312,
      avgRating: 4.3,
      completionRate: 0.91,
      totalRatings: 89
    },
    aiAnalysis: {
      summary: 'Practical productivity tips specifically tailored for software developers.',
      keyPoints: [
        'Time blocking techniques',
        'Managing interruptions',
        'Balancing coding and meetings',
        'Tools for productivity tracking'
      ],
      learningObjectives: [
        'Improve daily productivity',
        'Better manage development time',
        'Reduce context switching'
      ],
      estimatedLearningTime: 25,
      complexityScore: 2
    }
  },
  {
    contentId: 'yt_machine_learning_005',
    title: 'Machine Learning Fundamentals',
    description: 'Introduction to machine learning concepts, algorithms, and practical applications.',
    source: 'youtube',
    url: 'https://youtube.com/watch?v=sample5',
    thumbnail: 'https://img.youtube.com/vi/sample5/maxresdefault.jpg',
    metadata: {
      durationSec: 4200, // 70 minutes
      lengthCategory: 'long',
      tags: ['machine learning', 'ai', 'algorithms', 'python', 'data science'],
      publishedAt: new Date('2024-01-25'),
      difficulty: 'intermediate',
      category: 'technology',
      language: 'en',
      keyTopics: ['supervised learning', 'unsupervised learning', 'neural networks', 'algorithms']
    },
    consumptionStats: {
      views: 178,
      avgRating: 4.6,
      completionRate: 0.58,
      totalRatings: 42
    },
    aiAnalysis: {
      summary: 'Comprehensive introduction to machine learning theory and practical implementation.',
      keyPoints: [
        'Understanding different ML algorithms',
        'Supervised vs unsupervised learning',
        'Model training and evaluation',
        'Real-world ML applications'
      ],
      learningObjectives: [
        'Understand ML fundamentals',
        'Implement basic ML algorithms',
        'Evaluate model performance'
      ],
      estimatedLearningTime: 120,
      complexityScore: 7
    }
  }
];

async function seedContent() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing sample content
    await Content.deleteMany({ contentId: { $in: sampleContent.map(c => c.contentId) } });
    console.log('Cleared existing sample content');

    // Generate embeddings and save content
    for (const contentData of sampleContent) {
      console.log(`Processing: ${contentData.title}`);
      
      try {
        // Generate fallback embedding for content (since OpenAI key is not set)
        const textForEmbedding = `${contentData.title} ${contentData.description} ${contentData.metadata.tags.join(' ')} ${contentData.metadata.keyTopics.join(' ')}`;
        const embedding = embeddingUtils.generateFallbackEmbedding(textForEmbedding);
        
        // Create content document
        const content = new Content({
          ...contentData,
          embedding,
          isActive: true
        });

        await content.save();
        console.log(`✓ Saved: ${contentData.title}`);
      } catch (error) {
        console.error(`✗ Error saving ${contentData.title}:`, error.message);
      }
    }

    console.log('\n✅ Sample content seeding completed!');
    console.log(`Total content items: ${sampleContent.length}`);
    
  } catch (error) {
    console.error('Error seeding content:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding script
seedContent();