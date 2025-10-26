import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  contentId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  
  // Quiz configuration
  type: {
    type: String,
    enum: ['comprehension', 'application', 'retention', 'adaptive'],
    default: 'comprehension'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  timeLimit: { type: Number, default: 300 }, // seconds
  passingScore: { type: Number, default: 70, min: 0, max: 100 },
  maxAttempts: { type: Number, default: 3 },
  
  // Questions
  questions: [{
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'short-answer', 'matching', 'ordering'],
      required: true
    },
    question: { type: String, required: true },
    options: [String], // For multiple choice
    correctAnswer: mongoose.Schema.Types.Mixed, // Flexible for different question types
    explanation: String,
    points: { type: Number, default: 1 },
    concepts: [String], // Learning concepts this question tests
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    timeToAnswer: { type: Number, default: 30 } // seconds
  }],
  
  // AI-generated content
  aiGenerated: { type: Boolean, default: false },
  generatedFrom: {
    transcript: String,
    keyPoints: [String],
    learningObjectives: [String]
  },
  
  // Analytics
  stats: {
    totalAttempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 },
    passRate: { type: Number, default: 0 },
    questionStats: [{
      questionId: String,
      correctRate: { type: Number, default: 0 },
      averageTime: { type: Number, default: 0 }
    }]
  },
  
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Indexes
quizSchema.index({ contentId: 1, isActive: 1 });
quizSchema.index({ difficulty: 1, type: 1 });

// Static method to generate quiz from content
quizSchema.statics.generateFromContent = async function(contentId, options = {}) {
  const Content = mongoose.model('Content');
  const content = await Content.findOne({ contentId }).select('title description metadata aiAnalysis');
  
  if (!content) {
    // For demo purposes, create a sample quiz even if content not found
    return new this({
      contentId,
      title: `Quiz: ${contentId}`,
      type: options.type || 'comprehension',
      difficulty: options.difficulty || 'intermediate',
      questions: generateSampleQuestions(contentId),
      aiGenerated: true,
      generatedFrom: {
        transcript: 'Sample content',
        keyPoints: ['Key concept 1', 'Key concept 2'],
        learningObjectives: ['Understand basics', 'Apply knowledge']
      }
    });
  }
  
  // Generate questions based on content
  const questions = generateQuestionsFromContent(content);
  
  const quiz = {
    contentId,
    title: `Quiz: ${content.title}`,
    type: options.type || 'comprehension',
    difficulty: options.difficulty || content.metadata?.difficulty || 'intermediate',
    questions,
    aiGenerated: true,
    generatedFrom: {
      transcript: content.metadata?.transcript || content.description,
      keyPoints: content.aiAnalysis?.keyPoints || [],
      learningObjectives: content.aiAnalysis?.learningObjectives || []
    }
  };
  
  return new this(quiz);
};

// Helper function to generate sample questions
function generateSampleQuestions(contentId) {
  return [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'What is the main topic of this video?',
      options: ['Programming', 'Design', 'Business', 'Science'],
      correctAnswer: 'Programming',
      explanation: 'Based on the video content, the main focus is on programming concepts.',
      points: 1,
      concepts: ['programming basics'],
      difficulty: 'easy'
    },
    {
      id: 'q2',
      type: 'true-false',
      question: 'This video covers advanced concepts.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The video focuses on beginner to intermediate concepts.',
      points: 1,
      concepts: ['difficulty assessment'],
      difficulty: 'medium'
    },
    {
      id: 'q3',
      type: 'short-answer',
      question: 'What is one key takeaway from this video?',
      correctAnswer: 'Understanding the fundamentals is important for building a strong foundation.',
      explanation: 'The video emphasizes the importance of mastering basics before moving to advanced topics.',
      points: 2,
      concepts: ['key concepts', 'learning strategy'],
      difficulty: 'medium'
    }
  ];
}

// Helper function to generate questions from actual content
function generateQuestionsFromContent(content) {
  const questions = [];
  
  // Generate questions based on title and description
  if (content.title.toLowerCase().includes('typescript')) {
    questions.push({
      id: 'q1',
      type: 'multiple-choice',
      question: 'What is TypeScript?',
      options: [
        'A JavaScript framework',
        'A superset of JavaScript that adds static typing',
        'A database language',
        'A CSS preprocessor'
      ],
      correctAnswer: 'A superset of JavaScript that adds static typing',
      explanation: 'TypeScript is a programming language that builds on JavaScript by adding static type definitions.',
      points: 1,
      concepts: ['typescript basics'],
      difficulty: 'easy'
    });
    
    questions.push({
      id: 'q2',
      type: 'true-false',
      question: 'TypeScript code can run directly in the browser without compilation.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'TypeScript must be compiled to JavaScript before it can run in browsers.',
      points: 1,
      concepts: ['typescript compilation'],
      difficulty: 'medium'
    });
  } else if (content.title.toLowerCase().includes('react')) {
    questions.push({
      id: 'q1',
      type: 'multiple-choice',
      question: 'What is React primarily used for?',
      options: [
        'Backend development',
        'Database management',
        'Building user interfaces',
        'Server configuration'
      ],
      correctAnswer: 'Building user interfaces',
      explanation: 'React is a JavaScript library for building user interfaces, especially web applications.',
      points: 1,
      concepts: ['react basics'],
      difficulty: 'easy'
    });
  } else {
    // Generic programming questions
    questions.push(...generateSampleQuestions(content.contentId));
  }
  
  return questions;
}

export default mongoose.model('Quiz', quizSchema);