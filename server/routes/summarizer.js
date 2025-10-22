import express from 'express';
import fetch from 'node-fetch';
import Summary from '../models/Summary.js';
import Content from '../models/Content.js';
import aiService from '../services/aiService.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Generate summary
router.post('/generate', async (req, res) => {
  try {
    const { 
      contentId, 
      mode = 'insight', 
      customPrompt,
      content: summaryContent,
      keyInsights,
      actionableItems,
      mentalModels,
      relatedTopics,
      difficulty,
      timeToRead,
      originalContent,
      tags
    } = req.body;
    const userId = req.user._id;

    if (!contentId) {
      return res.status(400).json({ error: 'Content ID is required' });
    }

    // Check if summary already exists
    const existingSummary = await Summary.findOne({ 
      'originalContent.title': originalContent?.title,
      mode, 
      userId 
    });
    if (existingSummary) {
      return res.json(existingSummary);
    }
    
    // Create summary document
    const summary = new Summary({
      contentId: contentId,
      mode,
      content: summaryContent,
      keyInsights: keyInsights || [],
      actionableItems: actionableItems || [],
      mentalModels: mentalModels || [],
      relatedTopics: relatedTopics || [],
      difficulty: difficulty || 'intermediate',
      timeToRead: timeToRead || 5,
      originalContent: originalContent || {},
      tags: tags || [],
      userId
    });

    await summary.save();
    res.status(201).json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all summaries
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, mode, difficulty, tags } = req.query;
    const userId = req.user._id;

    const filter = { userId };
    if (mode) filter.mode = mode;
    if (difficulty) filter.difficulty = difficulty;
    if (tags) filter.tags = { $in: tags.split(',') };

    const summaries = await Summary.find(filter)
      .populate('contentId', 'title url source')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Summary.countDocuments(filter);

    res.json({
      summaries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get summary by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user._id;
    const summary = await Summary.findOne({ _id: req.params.id, userId })
      .populate('contentId', 'title url source');

    if (!summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update summary (rating, notes)
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user._id;
    const { rating, notes } = req.body;

    const summary = await Summary.findOneAndUpdate(
      { _id: req.params.id, userId },
      { rating, notes },
      { new: true, runValidators: true }
    );

    if (!summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }

    res.json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete summary
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user._id;
    const summary = await Summary.findOneAndDelete({ _id: req.params.id, userId });

    if (!summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }

    res.json({ message: 'Summary deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate AI summary
async function generateAISummary(content, mode, customPrompt) {
  const prompt = customPrompt || buildSummaryPrompt(content, mode);

  try {
    const aiResponse = await aiService.generateText(prompt, { 
      maxTokens: getMaxTokens(mode), 
      temperature: 0.7 
    });
    
    return parseSummaryResponse(aiResponse, content, mode);
  } catch (error) {
    console.error('AI summary generation failed:', error);
    return generateFallbackSummary(content, mode);
  }
}

function buildSummaryPrompt(content, mode) {
  const textContent = `${content.title}\n${content.description || ''}`;
  
  const basePrompt = `Analyze this content and create an explanatory ${mode} summary:

Content: ${textContent}

Focus on explaining concepts clearly and providing educational value. Please provide:`;

  switch (mode) {
    case 'tldr':
      return `${basePrompt}
1. **What it is**: Clear definition/explanation in 1-2 sentences
2. **Why it matters**: Key benefits and importance (3 bullet points)
3. **How to start**: One concrete first step
4. **Quick wins**: 2-3 immediate applications
5. **Difficulty level**: Beginner/Intermediate/Advanced with brief reasoning`;

    case 'insight':
      return `${basePrompt}
1. **Core Explanation**: What this topic is and why it's important (2-3 sentences)
2. **Key Concepts**: 4-5 fundamental ideas explained clearly with examples
3. **Mental Models**: Frameworks or ways of thinking about this topic
4. **Practical Applications**: Real-world uses and scenarios
5. **Getting Started**: Step-by-step approach for beginners
6. **Next Level**: How to advance understanding`;

    case 'detailed':
      return `${basePrompt}
1. **Comprehensive Explanation**: Thorough overview
2. **Fundamental Concepts**: Core principles with detailed explanations
3. **Practical Framework**: Step-by-step processes
4. **Real-World Examples**: Multiple case studies
5. **Learning Path**: Progressive roadmap from beginner to expert
6. **Tools and Resources**: Specific recommendations`;

    default:
      return `${basePrompt} A balanced, educational summary with practical takeaways.`;
  }
}

function parseSummaryResponse(aiResponse, content, mode) {
  return {
    content: aiResponse,
    keyInsights: extractKeyInsights(aiResponse),
    actionableItems: extractActionableItems(aiResponse),
    mentalModels: extractMentalModels(aiResponse),
    relatedTopics: extractRelatedTopics(aiResponse),
    difficulty: assessDifficulty(aiResponse),
    timeToRead: estimateReadingTime(aiResponse),
    tags: generateSummaryTags(aiResponse, content)
  };
}

function generateFallbackSummary(content, mode) {
  const title = content.title;
  const description = content.description || '';
  
  let summaryContent = '';
  
  switch (mode) {
    case 'tldr':
      summaryContent = `**What is ${title}?**
${title} is an important topic that provides practical knowledge and skills.

**Why it matters:**
• Provides valuable learning opportunities
• Has practical applications
• Forms foundation for further understanding

**How to start:** Begin with basic concepts
**Difficulty:** Intermediate`;
      break;
      
    default:
      summaryContent = `${title} is an important topic that offers practical value and learning opportunities. ${description}`;
  }

  return {
    content: summaryContent,
    keyInsights: ['Key learning opportunity', 'Practical applications available'],
    actionableItems: ['Start with basic concepts', 'Apply knowledge practically'],
    mentalModels: ['Framework for understanding'],
    relatedTopics: ['Related learning topics'],
    difficulty: 'intermediate',
    timeToRead: 5,
    tags: content.tags || ['learning']
  };
}

function extractKeyInsights(text) {
  const insights = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.toLowerCase().includes('insight') || 
        line.toLowerCase().includes('key point') ||
        line.toLowerCase().includes('takeaway')) {
      insights.push(line.replace(/^\d+\.\s*/, '').trim());
    }
  }
  
  return insights.slice(0, 5);
}

function extractActionableItems(text) {
  const actions = [];
  const actionKeywords = ['action', 'do', 'implement', 'try', 'practice', 'apply'];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (actionKeywords.some(keyword => lowerLine.includes(keyword))) {
      actions.push(line.replace(/^\d+\.\s*/, '').trim());
    }
  }
  
  return actions.slice(0, 3);
}

function extractMentalModels(text) {
  const models = [];
  const modelKeywords = ['model', 'framework', 'principle', 'concept'];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (modelKeywords.some(keyword => lowerLine.includes(keyword))) {
      models.push(line.replace(/^\d+\.\s*/, '').trim());
    }
  }
  
  return models.slice(0, 3);
}

function extractRelatedTopics(text) {
  const topics = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.toLowerCase().includes('related') || 
        line.toLowerCase().includes('similar')) {
      const matches = line.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
      if (matches) {
        topics.push(...matches);
      }
    }
  }
  
  return [...new Set(topics)].slice(0, 5);
}

function assessDifficulty(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('beginner') || lowerText.includes('basic')) {
    return 'beginner';
  } else if (lowerText.includes('advanced') || lowerText.includes('expert')) {
    return 'advanced';
  }
  
  return 'intermediate';
}

function estimateReadingTime(text) {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function generateSummaryTags(text, content) {
  const tags = [...(content.tags || [])];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('productivity')) tags.push('productivity');
  if (lowerText.includes('learning')) tags.push('learning');
  if (lowerText.includes('strategy')) tags.push('strategy');
  if (lowerText.includes('framework')) tags.push('framework');
  
  return [...new Set(tags)];
}

function getMaxTokens(mode) {
  switch (mode) {
    case 'tldr': return 150;
    case 'insight': return 500;
    case 'detailed': return 1000;
    default: return 300;
  }
}

export default router;