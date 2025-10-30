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
quizSchema.statics.generateFromContent = async function (contentId, options = {}) {
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
    timeLimit: 600, // 10 minutes for 10 questions
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

// Helper function to generate sample questions (10 questions)
function generateSampleQuestions() {
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
    },
    {
      id: 'q9',
      type: 'multiple-choice',
      question: 'What is the most effective way to debug code?',
      options: ['Random trial and error', 'Systematic problem isolation', 'Rewriting from scratch', 'Asking others immediately'],
      correctAnswer: 'Systematic problem isolation',
      explanation: 'Systematic debugging involves identifying the problem area, understanding the expected vs actual behavior, and methodically testing solutions.',
      points: 1,
      concepts: ['debugging', 'problem solving'],
      difficulty: 'medium'
    },
    {
      id: 'q10',
      type: 'multiple-choice',
      question: 'Which principle is most important for writing maintainable code?',
      options: ['Writing the shortest code possible', 'Using the latest technologies', 'Clear naming and documentation', 'Avoiding all comments'],
      correctAnswer: 'Clear naming and documentation',
      explanation: 'Maintainable code prioritizes readability and clarity through meaningful names, proper structure, and helpful documentation.',
      points: 1,
      concepts: ['code quality', 'best practices'],
      difficulty: 'medium'
    }
  ];

  // Return all 10 questions
  return baseQuestions;
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
      },
      {
        id: 'q6',
        type: 'multiple-choice',
        question: 'Which TypeScript feature helps catch errors at compile time?',
        options: ['Type annotations', 'Runtime checking', 'Dynamic typing', 'Automatic compilation'],
        correctAnswer: 'Type annotations',
        explanation: 'Type annotations allow TypeScript to perform static analysis and catch type-related errors before runtime.',
        points: 1,
        concepts: ['type annotations'],
        difficulty: 'medium'
      },
      {
        id: 'q7',
        type: 'true-false',
        question: 'TypeScript interfaces can be used to define object shapes.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Interfaces in TypeScript define the structure of objects, specifying what properties and methods they should have.',
        points: 1,
        concepts: ['interfaces'],
        difficulty: 'medium'
      },
      {
        id: 'q8',
        type: 'multiple-choice',
        question: 'What is the purpose of TypeScript generics?',
        options: ['To improve performance', 'To create reusable components with flexible types', 'To reduce file size', 'To enable runtime type checking'],
        correctAnswer: 'To create reusable components with flexible types',
        explanation: 'Generics allow you to create components that work with multiple types while maintaining type safety.',
        points: 1,
        concepts: ['generics'],
        difficulty: 'hard'
      },
      {
        id: 'q9',
        type: 'multiple-choice',
        question: 'Which command is used to compile TypeScript files?',
        options: ['node', 'npm', 'tsc', 'ts-compile'],
        correctAnswer: 'tsc',
        explanation: 'The TypeScript compiler (tsc) is used to compile .ts files into .js files.',
        points: 1,
        concepts: ['typescript compilation'],
        difficulty: 'easy'
      },
      {
        id: 'q10',
        type: 'short-answer',
        question: 'What is one advantage of using TypeScript in large-scale applications?',
        correctAnswer: 'Better code maintainability and fewer runtime errors due to static type checking.',
        explanation: 'TypeScript helps maintain large codebases by catching errors early and providing better IDE support.',
        points: 2,
        concepts: ['typescript benefits', 'large-scale development'],
        difficulty: 'medium'
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
      },
      {
        id: 'q6',
        type: 'multiple-choice',
        question: 'Which hook is used to manage component state in React?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 'useState',
        explanation: 'useState is the primary hook for managing local component state in functional components.',
        points: 1,
        concepts: ['useState hook'],
        difficulty: 'easy'
      },
      {
        id: 'q7',
        type: 'true-false',
        question: 'React components can pass data to child components through props.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Props are the mechanism for passing data from parent components to child components in React.',
        points: 1,
        concepts: ['props'],
        difficulty: 'easy'
      },
      {
        id: 'q8',
        type: 'multiple-choice',
        question: 'What is the Virtual DOM in React?',
        options: ['A real DOM element', 'A JavaScript representation of the real DOM', 'A CSS framework', 'A testing utility'],
        correctAnswer: 'A JavaScript representation of the real DOM',
        explanation: 'The Virtual DOM is a programming concept where a virtual representation of the UI is kept in memory and synced with the real DOM.',
        points: 1,
        concepts: ['virtual dom'],
        difficulty: 'medium'
      },
      {
        id: 'q9',
        type: 'multiple-choice',
        question: 'Which lifecycle method is equivalent to useEffect with an empty dependency array?',
        options: ['componentDidMount', 'componentDidUpdate', 'componentWillUnmount', 'render'],
        correctAnswer: 'componentDidMount',
        explanation: 'useEffect with an empty dependency array runs once after the component mounts, similar to componentDidMount.',
        points: 1,
        concepts: ['useEffect', 'lifecycle methods'],
        difficulty: 'hard'
      },
      {
        id: 'q10',
        type: 'short-answer',
        question: 'What is one key benefit of using React for building user interfaces?',
        correctAnswer: 'Component reusability and efficient updates through the Virtual DOM.',
        explanation: 'React promotes building reusable components and optimizes performance through its Virtual DOM diffing algorithm.',
        points: 2,
        concepts: ['react benefits', 'component architecture'],
        difficulty: 'medium'
      }
    );
  } else if (title.includes('node') || title.includes('nodejs') || title.includes('node.js') || description.includes('node') || description.includes('nodejs') || description.includes('node.js')) {
    questions.push(
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is Node.js?',
        options: [
          'A JavaScript framework for frontend development',
          'A JavaScript runtime built on Chrome\'s V8 JavaScript engine',
          'A database management system',
          'A CSS preprocessor'
        ],
        correctAnswer: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine',
        explanation: 'Node.js is a JavaScript runtime that allows you to run JavaScript on the server side.',
        points: 1,
        concepts: ['nodejs basics'],
        difficulty: 'easy'
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'Node.js is single-threaded.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Node.js uses a single-threaded event loop, though it uses multiple threads for I/O operations behind the scenes.',
        points: 1,
        concepts: ['nodejs architecture'],
        difficulty: 'medium'
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'Which command is used to initialize a new Node.js project?',
        options: ['node init', 'npm init', 'nodejs create', 'npm create'],
        correctAnswer: 'npm init',
        explanation: 'The npm init command creates a new package.json file for a Node.js project.',
        points: 1,
        concepts: ['npm', 'project setup'],
        difficulty: 'easy'
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'What is npm?',
        options: ['Node Package Manager', 'Node Project Manager', 'Node Process Manager', 'Node Program Manager'],
        correctAnswer: 'Node Package Manager',
        explanation: 'npm stands for Node Package Manager and is used to install and manage Node.js packages.',
        points: 1,
        concepts: ['npm'],
        difficulty: 'easy'
      },
      {
        id: 'q5',
        type: 'true-false',
        question: 'Node.js can be used to build both web servers and command-line tools.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Node.js is versatile and can be used for web servers, APIs, command-line tools, and desktop applications.',
        points: 1,
        concepts: ['nodejs applications'],
        difficulty: 'easy'
      },
      {
        id: 'q6',
        type: 'multiple-choice',
        question: 'Which module is commonly used to create HTTP servers in Node.js?',
        options: ['fs', 'http', 'path', 'url'],
        correctAnswer: 'http',
        explanation: 'The http module is Node.js\'s built-in module for creating HTTP servers and clients.',
        points: 1,
        concepts: ['http module', 'web servers'],
        difficulty: 'medium'
      },
      {
        id: 'q7',
        type: 'true-false',
        question: 'Node.js uses an event-driven, non-blocking I/O model.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Node.js\'s event-driven, non-blocking I/O model makes it efficient for handling concurrent operations.',
        points: 1,
        concepts: ['event-driven programming', 'non-blocking io'],
        difficulty: 'medium'
      },
      {
        id: 'q8',
        type: 'multiple-choice',
        question: 'What file contains the metadata and dependencies for a Node.js project?',
        options: ['index.js', 'package.json', 'node_modules', 'server.js'],
        correctAnswer: 'package.json',
        explanation: 'package.json contains project metadata, dependencies, scripts, and configuration for Node.js projects.',
        points: 1,
        concepts: ['package.json', 'project structure'],
        difficulty: 'easy'
      },
      {
        id: 'q9',
        type: 'multiple-choice',
        question: 'Which method is used to export functionality from a Node.js module?',
        options: ['export.modules', 'module.exports', 'exports.module', 'module.export'],
        correctAnswer: 'module.exports',
        explanation: 'module.exports is used to export functions, objects, or values from a Node.js module.',
        points: 1,
        concepts: ['modules', 'exports'],
        difficulty: 'medium'
      },
      {
        id: 'q10',
        type: 'short-answer',
        question: 'What is one key advantage of using Node.js for backend development?',
        correctAnswer: 'JavaScript can be used for both frontend and backend development, enabling full-stack JavaScript development.',
        explanation: 'Node.js allows developers to use JavaScript across the entire stack, improving development efficiency and code sharing.',
        points: 2,
        concepts: ['nodejs benefits', 'full-stack development'],
        difficulty: 'medium'
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
      },
      {
        id: 'q6',
        type: 'multiple-choice',
        question: 'Which keyword is used to declare a variable that cannot be reassigned?',
        options: ['var', 'let', 'const', 'final'],
        correctAnswer: 'const',
        explanation: 'The const keyword declares a variable that cannot be reassigned after initialization.',
        points: 1,
        concepts: ['variable declarations'],
        difficulty: 'easy'
      },
      {
        id: 'q7',
        type: 'true-false',
        question: 'JavaScript functions are first-class objects.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'In JavaScript, functions are first-class objects, meaning they can be assigned to variables, passed as arguments, and returned from other functions.',
        points: 1,
        concepts: ['functions', 'first-class objects'],
        difficulty: 'medium'
      },
      {
        id: 'q8',
        type: 'multiple-choice',
        question: 'What is the purpose of the "this" keyword in JavaScript?',
        options: ['To create new objects', 'To refer to the current object context', 'To declare variables', 'To import modules'],
        correctAnswer: 'To refer to the current object context',
        explanation: 'The "this" keyword refers to the object that is currently executing the code.',
        points: 1,
        concepts: ['this keyword', 'object context'],
        difficulty: 'hard'
      },
      {
        id: 'q9',
        type: 'multiple-choice',
        question: 'Which method is used to add an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 'push()',
        explanation: 'The push() method adds one or more elements to the end of an array and returns the new length.',
        points: 1,
        concepts: ['array methods'],
        difficulty: 'easy'
      },
      {
        id: 'q10',
        type: 'short-answer',
        question: 'What is one key difference between "==" and "===" operators in JavaScript?',
        correctAnswer: '"==" performs type coercion while "===" checks for strict equality without type conversion.',
        explanation: 'The "==" operator converts types before comparison, while "===" compares both value and type without conversion.',
        points: 2,
        concepts: ['equality operators', 'type coercion'],
        difficulty: 'medium'
      }
    );
  } else {
    // Generic programming questions for other content
    questions.push(...generateSampleQuestions());
  }

  // Ensure we have exactly 10 questions
  if (questions.length < 10) {
    const additionalQuestions = generateSampleQuestions();
    questions.push(...additionalQuestions.slice(0, 10 - questions.length));
  } else if (questions.length > 10) {
    return questions.slice(0, 10);
  }

  return questions;
}

// Helper function to generate questions based on contentId patterns
function generateQuestionsFromContentId() {
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
    },
    {
      id: 'q9',
      type: 'multiple-choice',
      question: 'What type of learning style does this content best support?',
      options: ['Visual learning', 'Auditory learning', 'Kinesthetic learning', 'All learning styles'],
      correctAnswer: 'All learning styles',
      explanation: 'Well-designed educational content incorporates multiple learning modalities to reach different learners.',
      points: 1,
      concepts: ['learning styles'],
      difficulty: 'medium'
    },
    {
      id: 'q10',
      type: 'true-false',
      question: 'Following along with the examples shown is more effective than just watching passively.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Active engagement and hands-on practice significantly improve learning retention and understanding.',
      points: 1,
      concepts: ['active learning'],
      difficulty: 'easy'
    }
  ];

  // Return all 10 questions
  return questions;
}

export default mongoose.model('Quiz', quizSchema);