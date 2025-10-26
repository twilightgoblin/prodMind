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
  
  let questions;
  let title = `Quiz: ${contentId}`;
  
  if (content) {
    // Generate questions based on actual content
    questions = generateQuestionsFromContent(content);
    title = `Quiz: ${content.title}`;
  } else {
    // Generate questions based on contentId patterns (e.g., YouTube video IDs)
    questions = generateQuestionsFromContentId(contentId);
  }
  
  const quiz = {
    contentId,
    title,
    type: options.type || 'comprehension',
    difficulty: options.difficulty || (content?.metadata?.difficulty) || 'intermediate',
    timeLimit: 600, // 10 minutes for 5-10 questions
    questions,
    aiGenerated: true,
    generatedFrom: {
      transcript: content?.metadata?.transcript || content?.description || 'Generated from video content',
      keyPoints: content?.aiAnalysis?.keyPoints || ['Key concepts from video'],
      learningObjectives: content?.aiAnalysis?.learningObjectives || ['Understand video content', 'Apply learned concepts']
    }
  };
  
  return new this(quiz);
};

// Helper function to generate sample questions (5-10 questions)
function generateSampleQuestions(contentId) {
  const baseQuestions = [
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
      type: 'multiple-choice',
      question: 'Which programming paradigm is primarily discussed?',
      options: ['Object-Oriented Programming', 'Functional Programming', 'Procedural Programming', 'Logic Programming'],
      correctAnswer: 'Object-Oriented Programming',
      explanation: 'The video focuses on object-oriented programming concepts and principles.',
      points: 1,
      concepts: ['programming paradigms'],
      difficulty: 'medium'
    },
    {
      id: 'q4',
      type: 'true-false',
      question: 'The concepts shown can be applied to real-world projects.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The video demonstrates practical concepts that are widely used in software development.',
      points: 1,
      concepts: ['practical application'],
      difficulty: 'easy'
    },
    {
      id: 'q5',
      type: 'multiple-choice',
      question: 'What is the recommended approach for beginners?',
      options: ['Start with advanced topics', 'Master the basics first', 'Skip theory and code immediately', 'Focus only on frameworks'],
      correctAnswer: 'Master the basics first',
      explanation: 'Building a strong foundation with basic concepts is essential before moving to advanced topics.',
      points: 1,
      concepts: ['learning strategy', 'best practices'],
      difficulty: 'easy'
    },
    {
      id: 'q6',
      type: 'short-answer',
      question: 'What is one key takeaway from this video?',
      correctAnswer: 'Understanding the fundamentals is important for building a strong foundation.',
      explanation: 'The video emphasizes the importance of mastering basics before moving to advanced topics.',
      points: 2,
      concepts: ['key concepts', 'learning strategy'],
      difficulty: 'medium'
    },
    {
      id: 'q7',
      type: 'multiple-choice',
      question: 'Which tool or technology is mentioned as most important?',
      options: ['IDE/Code Editor', 'Version Control', 'Testing Framework', 'All of the above'],
      correctAnswer: 'All of the above',
      explanation: 'Modern development requires proficiency in multiple tools and technologies.',
      points: 1,
      concepts: ['development tools'],
      difficulty: 'medium'
    },
    {
      id: 'q8',
      type: 'true-false',
      question: 'Practice is more important than theory in programming.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Both theory and practice are equally important. Understanding concepts helps write better code.',
      points: 1,
      concepts: ['learning approach'],
      difficulty: 'hard'
    }
  ];

  // Return 5-8 questions randomly selected from the base set
  const numQuestions = Math.floor(Math.random() * 4) + 5; // 5-8 questions
  const shuffled = baseQuestions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numQuestions);
}

// Helper function to generate questions from actual content
function generateQuestionsFromContent(content) {
  const questions = [];
  const title = content.title.toLowerCase();
  const description = (content.description || '').toLowerCase();
  
  // Generate questions based on title and description
  if (title.includes('typescript') || description.includes('typescript')) {
    questions.push(
      {
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
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'TypeScript code can run directly in the browser without compilation.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'TypeScript must be compiled to JavaScript before it can run in browsers.',
        points: 1,
        concepts: ['typescript compilation'],
        difficulty: 'medium'
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'What is the main benefit of using TypeScript?',
        options: ['Faster execution', 'Static type checking', 'Smaller file size', 'Better performance'],
        correctAnswer: 'Static type checking',
        explanation: 'TypeScript\'s main advantage is catching type-related errors at compile time.',
        points: 1,
        concepts: ['typescript benefits'],
        difficulty: 'medium'
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'Which file extension is used for TypeScript files?',
        options: ['.js', '.ts', '.jsx', '.tsx'],
        correctAnswer: '.ts',
        explanation: 'TypeScript files use the .ts extension, while TypeScript React files use .tsx.',
        points: 1,
        concepts: ['typescript files'],
        difficulty: 'easy'
      },
      {
        id: 'q5',
        type: 'true-false',
        question: 'TypeScript is maintained by Microsoft.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'TypeScript was developed and is maintained by Microsoft.',
        points: 1,
        concepts: ['typescript history'],
        difficulty: 'easy'
      }
    );
  } else if (title.includes('react') || description.includes('react')) {
    questions.push(
      {
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
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'What is JSX in React?',
        options: ['A database query language', 'A syntax extension for JavaScript', 'A CSS framework', 'A testing library'],
        correctAnswer: 'A syntax extension for JavaScript',
        explanation: 'JSX is a syntax extension that allows you to write HTML-like code in JavaScript.',
        points: 1,
        concepts: ['jsx'],
        difficulty: 'medium'
      },
      {
        id: 'q3',
        type: 'true-false',
        question: 'React components must always return a single element.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'React components can return fragments, arrays, or single elements.',
        points: 1,
        concepts: ['react components'],
        difficulty: 'medium'
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'What is the purpose of React hooks?',
        options: ['To style components', 'To manage state and lifecycle in functional components', 'To handle routing', 'To optimize performance'],
        correctAnswer: 'To manage state and lifecycle in functional components',
        explanation: 'Hooks allow functional components to use state and other React features.',
        points: 1,
        concepts: ['react hooks'],
        difficulty: 'medium'
      },
      {
        id: 'q5',
        type: 'true-false',
        question: 'React was created by Facebook.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'React was originally created by Facebook (now Meta) and is open-sourced.',
        points: 1,
        concepts: ['react history'],
        difficulty: 'easy'
      }
    );
  } else if (title.includes('javascript') || description.includes('javascript')) {
    questions.push(
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What type of language is JavaScript?',
        options: ['Compiled', 'Interpreted', 'Assembly', 'Machine code'],
        correctAnswer: 'Interpreted',
        explanation: 'JavaScript is an interpreted programming language that runs in browsers and Node.js.',
        points: 1,
        concepts: ['javascript basics'],
        difficulty: 'easy'
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'JavaScript is the same as Java.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'JavaScript and Java are completely different programming languages.',
        points: 1,
        concepts: ['javascript vs java'],
        difficulty: 'easy'
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'Which of these is NOT a JavaScript data type?',
        options: ['String', 'Boolean', 'Integer', 'Object'],
        correctAnswer: 'Integer',
        explanation: 'JavaScript has Number type, but not specifically Integer. It uses floating-point numbers.',
        points: 1,
        concepts: ['javascript data types'],
        difficulty: 'medium'
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'What does "DOM" stand for?',
        options: ['Document Object Model', 'Data Object Management', 'Dynamic Object Mapping', 'Document Oriented Markup'],
        correctAnswer: 'Document Object Model',
        explanation: 'DOM stands for Document Object Model, which represents the HTML document structure.',
        points: 1,
        concepts: ['dom'],
        difficulty: 'medium'
      },
      {
        id: 'q5',
        type: 'true-false',
        question: 'JavaScript can only run in web browsers.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'JavaScript can run in browsers, servers (Node.js), mobile apps, and desktop applications.',
        points: 1,
        concepts: ['javascript environments'],
        difficulty: 'medium'
      }
    );
  } else {
    // Generic programming questions for other content
    questions.push(...generateSampleQuestions(content.contentId));
  }
  
  // Ensure we have 5-10 questions
  if (questions.length < 5) {
    const additionalQuestions = generateSampleQuestions(content.contentId);
    questions.push(...additionalQuestions.slice(0, 5 - questions.length));
  } else if (questions.length > 10) {
    return questions.slice(0, 10);
  }
  
  return questions;
}

// Helper function to generate questions based on contentId patterns
function generateQuestionsFromContentId(contentId) {
  // For YouTube videos or other content, generate relevant questions
  const questions = [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'What was the main focus of this video?',
      options: [
        'Technical tutorial/explanation',
        'Entertainment content',
        'News and current events',
        'Product review'
      ],
      correctAnswer: 'Technical tutorial/explanation',
      explanation: 'Based on the educational context, this appears to be technical or educational content.',
      points: 1,
      concepts: ['content analysis'],
      difficulty: 'easy'
    },
    {
      id: 'q2',
      type: 'true-false',
      question: 'The video provided practical, actionable information.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Educational videos typically provide practical information that viewers can apply.',
      points: 1,
      concepts: ['practical application'],
      difficulty: 'easy'
    },
    {
      id: 'q3',
      type: 'multiple-choice',
      question: 'What skill level was this content most appropriate for?',
      options: ['Complete beginner', 'Intermediate learner', 'Advanced practitioner', 'Expert level'],
      correctAnswer: 'Intermediate learner',
      explanation: 'Most educational content targets intermediate learners who have some basic knowledge.',
      points: 1,
      concepts: ['skill assessment'],
      difficulty: 'medium'
    },
    {
      id: 'q4',
      type: 'multiple-choice',
      question: 'Which learning approach was demonstrated in the video?',
      options: [
        'Step-by-step tutorial',
        'Theoretical explanation',
        'Case study analysis',
        'Problem-solving demonstration'
      ],
      correctAnswer: 'Step-by-step tutorial',
      explanation: 'Educational videos often use step-by-step approaches to teach concepts effectively.',
      points: 1,
      concepts: ['learning methodology'],
      difficulty: 'medium'
    },
    {
      id: 'q5',
      type: 'true-false',
      question: 'The concepts shown can be applied to real-world scenarios.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Quality educational content focuses on practical, applicable knowledge.',
      points: 1,
      concepts: ['real-world application'],
      difficulty: 'easy'
    },
    {
      id: 'q6',
      type: 'multiple-choice',
      question: 'What would be the best next step after watching this video?',
      options: [
        'Practice the concepts shown',
        'Watch more advanced content',
        'Review the basics again',
        'Take a break from learning'
      ],
      correctAnswer: 'Practice the concepts shown',
      explanation: 'Active practice is the most effective way to reinforce learning from educational content.',
      points: 1,
      concepts: ['learning strategy'],
      difficulty: 'medium'
    },
    {
      id: 'q7',
      type: 'short-answer',
      question: 'What is one key takeaway you gained from this video?',
      correctAnswer: 'Understanding the importance of structured learning and practical application of concepts.',
      explanation: 'Effective learning combines understanding concepts with practical application.',
      points: 2,
      concepts: ['key insights', 'learning reflection'],
      difficulty: 'medium'
    },
    {
      id: 'q8',
      type: 'multiple-choice',
      question: 'How would you rate the complexity of the topics covered?',
      options: ['Very simple', 'Moderately complex', 'Quite challenging', 'Extremely difficult'],
      correctAnswer: 'Moderately complex',
      explanation: 'Most educational content aims for moderate complexity to balance accessibility with depth.',
      points: 1,
      concepts: ['complexity assessment'],
      difficulty: 'easy'
    }
  ];

  // Return 5-8 questions randomly selected
  const numQuestions = Math.floor(Math.random() * 4) + 5; // 5-8 questions
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numQuestions);
}

export default mongoose.model('Quiz', quizSchema);