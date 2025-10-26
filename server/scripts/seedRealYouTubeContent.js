import mongoose from 'mongoose';
import Content from '../models/Content.js';
import embeddingUtils from '../utils/embeddingUtils.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// YouTube API helper function
async function searchYouTubeVideos(query, maxResults = 5) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
    `part=snippet&q=${encodeURIComponent(query)}&` +
    `type=video&maxResults=${maxResults}&` +
    `order=relevance&regionCode=US&relevanceLanguage=en&` +
    `key=${apiKey}`;

  const response = await fetch(searchUrl);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`YouTube API error: ${errorData.error?.message || 'Request failed'}`);
  }

  const data = await response.json();
  const videoIds = data.items.map(item => item.id.videoId).join(',');

  // Get additional video details
  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?` +
    `part=contentDetails,statistics,snippet&id=${videoIds}&` +
    `key=${apiKey}`;

  const detailsResponse = await fetch(detailsUrl);
  const detailsData = await detailsResponse.json();

  return detailsData.items.map(video => {
    const searchItem = data.items.find(item => item.id.videoId === video.id);
    return {
      ...video,
      searchSnippet: searchItem?.snippet
    };
  });
}

// Parse YouTube duration (PT4M13S) to seconds
function parseDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  
  return hours * 3600 + minutes * 60 + seconds;
}

// Determine difficulty based on title and description
function determineDifficulty(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('beginner') || text.includes('intro') || text.includes('basics') || 
      text.includes('getting started') || text.includes('fundamentals')) {
    return 'beginner';
  }
  
  if (text.includes('advanced') || text.includes('expert') || text.includes('master') ||
      text.includes('deep dive') || text.includes('complex')) {
    return 'advanced';
  }
  
  return 'intermediate';
}

// Extract tags from title and description
function extractTags(title, description, category) {
  const text = `${title} ${description}`.toLowerCase();
  const commonTags = {
    javascript: ['javascript', 'js', 'programming', 'web development'],
    react: ['react', 'reactjs', 'frontend', 'javascript', 'web development'],
    python: ['python', 'programming', 'data science', 'machine learning'],
    nodejs: ['nodejs', 'node', 'javascript', 'backend', 'server'],
    css: ['css', 'styling', 'web design', 'frontend'],
    html: ['html', 'web development', 'frontend', 'markup'],
    programming: ['programming', 'coding', 'software development'],
    tutorial: ['tutorial', 'learning', 'education'],
    productivity: ['productivity', 'efficiency', 'time management'],
    career: ['career', 'professional development', 'skills']
  };

  let tags = [category];
  
  Object.entries(commonTags).forEach(([key, keyTags]) => {
    if (text.includes(key)) {
      tags.push(...keyTags);
    }
  });

  // Remove duplicates and limit to 8 tags
  return [...new Set(tags)].slice(0, 8);
}

const searchQueries = [
  { query: 'JavaScript tutorial beginner 2024', category: 'programming', difficulty: 'beginner' },
  { query: 'React hooks tutorial advanced', category: 'programming', difficulty: 'advanced' },
  { query: 'Python data science pandas numpy', category: 'programming', difficulty: 'intermediate' },
  { query: 'Node.js backend development', category: 'programming', difficulty: 'intermediate' },
  { query: 'CSS flexbox grid layout', category: 'programming', difficulty: 'beginner' },
  { query: 'Machine learning Python tutorial', category: 'technology', difficulty: 'advanced' },
  { query: 'Web development full stack', category: 'programming', difficulty: 'intermediate' },
  { query: 'Programming productivity tips developers', category: 'productivity', difficulty: 'beginner' },
  { query: 'TypeScript tutorial JavaScript', category: 'programming', difficulty: 'intermediate' },
  { query: 'Vue.js frontend framework', category: 'programming', difficulty: 'intermediate' }
];

async function seedRealYouTubeContent() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing sample content
    await Content.deleteMany({ 
      contentId: { $regex: /^yt_real_/ } 
    });
    console.log('Cleared existing real YouTube content');

    let totalVideos = 0;

    for (const searchQuery of searchQueries) {
      console.log(`\nSearching for: ${searchQuery.query}`);
      
      try {
        const videos = await searchYouTubeVideos(searchQuery.query, 2); // Get 2 videos per query
        
        for (const video of videos) {
          const durationSec = parseDuration(video.contentDetails.duration);
          
          // Skip very short videos (less than 2 minutes) or very long ones (more than 2 hours)
          if (durationSec < 120 || durationSec > 7200) {
            console.log(`  Skipping ${video.snippet.title} (duration: ${durationSec}s)`);
            continue;
          }

          const difficulty = determineDifficulty(video.snippet.title, video.snippet.description);
          const tags = extractTags(video.snippet.title, video.snippet.description, searchQuery.category);
          
          const contentData = {
            contentId: `yt_real_${video.id}`,
            title: video.snippet.title,
            description: video.snippet.description?.substring(0, 500) || 'No description available',
            source: 'youtube',
            url: `https://www.youtube.com/watch?v=${video.id}`,
            thumbnail: video.snippet.thumbnails?.maxres?.url || 
                      video.snippet.thumbnails?.high?.url || 
                      video.snippet.thumbnails?.medium?.url,
            metadata: {
              durationSec,
              lengthCategory: durationSec < 600 ? 'short' : durationSec < 1800 ? 'medium' : 'long',
              tags,
              publishedAt: new Date(video.snippet.publishedAt),
              difficulty,
              category: searchQuery.category,
              language: 'en',
              keyTopics: tags.slice(0, 4), // First 4 tags as key topics
              channelTitle: video.snippet.channelTitle,
              channelId: video.snippet.channelId
            },
            consumptionStats: {
              views: parseInt(video.statistics?.viewCount) || 0,
              avgRating: 4.0 + Math.random() * 1.0, // Random rating between 4.0-5.0
              completionRate: 0.6 + Math.random() * 0.3, // Random completion rate 60-90%
              totalRatings: Math.floor((parseInt(video.statistics?.viewCount) || 1000) / 100)
            },
            aiAnalysis: {
              summary: `${video.snippet.title}. ${video.snippet.description?.substring(0, 200) || ''}`,
              keyPoints: [
                `Learn ${tags[0]} concepts and techniques`,
                `Practical examples and demonstrations`,
                `Step-by-step tutorial approach`,
                `Real-world applications and use cases`
              ],
              learningObjectives: [
                `Understand ${tags[0]} fundamentals`,
                `Apply concepts in practical projects`,
                `Build confidence with hands-on practice`
              ],
              estimatedLearningTime: Math.ceil(durationSec / 60) + 15, // Video duration + 15 min practice
              complexityScore: difficulty === 'beginner' ? 3 : difficulty === 'intermediate' ? 6 : 8
            }
          };

          try {
            // Generate embedding for content
            const textForEmbedding = `${contentData.title} ${contentData.description} ${contentData.metadata.tags.join(' ')} ${contentData.metadata.keyTopics.join(' ')}`;
            const embedding = embeddingUtils.generateFallbackEmbedding(textForEmbedding);
            
            // Create content document
            const content = new Content({
              ...contentData,
              embedding,
              isActive: true
            });

            await content.save();
            totalVideos++;
            console.log(`  ✓ Saved: ${contentData.title.substring(0, 60)}...`);
          } catch (error) {
            console.error(`  ✗ Error saving ${contentData.title}:`, error.message);
          }
        }
        
        // Add delay between API calls to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error searching for "${searchQuery.query}":`, error.message);
      }
    }

    console.log(`\n✅ Real YouTube content seeding completed!`);
    console.log(`Total videos added: ${totalVideos}`);
    
  } catch (error) {
    console.error('Error seeding real YouTube content:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding script
seedRealYouTubeContent();