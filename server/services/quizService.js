import { questionBanks, languageKeywords } from '../utils/questionBanks.js';
import QuizResult from '../models/QuizResult.js';
import crypto from 'crypto';

// Use question banks directly (now includes all new languages)
const mergedQuestionBanks = {
  ...questionBanks,
  // Add aliases for common variations
  'c#': questionBanks.csharp || [],
  'c++': questionBanks.cpp || [],
  golang: questionBanks.go || [],
  postgres: questionBanks.postgresql || [],
  mongo: questionBanks.mongodb || [],
  vuejs: questionBanks.vue || [],
  'vue.js': questionBanks.vue || [],
  k8s: questionBanks.kubernetes || [],
  'next.js': questionBanks.nextjs || [],
  'next': questionBanks.nextjs || [],
  'node.js': questionBanks.nodejs || [],
  'node': questionBanks.nodejs || [],
  'express.js': questionBanks.express || [],
  'react.js': questionBanks.react || [],
  '.net': questionBanks.csharp || [],
  'dotnet': questionBanks.csharp || [],
  'js': questionBanks.javascript || [],
  'ts': questionBanks.typescript || [],
  'py': questionBanks.python || []
};

/**
 * Find the best matching language/topic based on keywords
 */
function findMatchingTopic(searchTerm) {
  const normalized = searchTerm.toLowerCase().trim();
  
  // Direct match
  if (mergedQuestionBanks[normalized]) {
    return normalized;
  }
  
  // Check language keywords
  for (const [language, keywords] of Object.entries(languageKeywords)) {
    if (keywords.some(keyword => normalized.includes(keyword) || keyword.includes(normalized))) {
      return language;
    }
  }
  
  // Partial match in merged banks
  const partialMatch = Object.keys(mergedQuestionBanks).find(key => 
    key.includes(normalized) || normalized.includes(key)
  );
  
  return partialMatch || null;
}

// Store active quizzes in memory (use Redis in production for better scalability)
const activeQuizzes = new Map();

/**
 * Get all available questions from all topics
 */
function getAllQuestions() {
  const allQuestions = [];
  for (const [topic, questions] of Object.entries(mergedQuestionBanks)) {
    if (questions && questions.length > 0) {
      // Add topic info to each question for reference
      questions.forEach(q => {
        allQuestions.push({ ...q, sourceTopic: topic });
      });
    }
  }
  return allQuestions;
}

/**
 * Get 10 random questions from a topic's question bank
 */
export const getQuizQuestions = async (topic) => {
  const normalizedTopic = topic.toLowerCase().trim();
  
  // Find matching topic using keyword matching
  const matchingTopic = findMatchingTopic(normalizedTopic);
  
  // If no matching topic found, return random questions from all topics
  if (!matchingTopic) {
    console.log(`No specific topic found for "${topic}", generating random quiz from all topics`);
    const allQuestions = getAllQuestions();
    
    if (allQuestions.length < 10) {
      throw new Error(`Insufficient questions available. Only ${allQuestions.length} questions in database.`);
    }
    
    return generateQuiz('Mixed Topics', allQuestions);
  }
  
  const questionBank = mergedQuestionBanks[matchingTopic];
  
  if (!questionBank || questionBank.length === 0) {
    throw new Error(`No questions available for topic: ${topic}. This topic is not yet supported.`);
  }
  
  return generateQuiz(matchingTopic, questionBank);
};

/**
 * Generate a quiz with 10 random questions
 */
function generateQuiz(topic, questions) {
  if (!questions || questions.length === 0) {
    throw new Error(`No questions available for topic: ${topic}. This topic is not yet supported.`);
  }
  
  if (questions.length < 10) {
    throw new Error(`Insufficient questions for topic: ${topic}. Only ${questions.length} questions available, but 10 are required.`);
  }
  
  // Shuffle and select 10 random questions
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffled.slice(0, 10);
  
  // Generate quiz ID
  const quizId = crypto.randomUUID();
  
  // Store quiz with answers for validation
  activeQuizzes.set(quizId, {
    topic,
    questions: selectedQuestions,
    createdAt: Date.now()
  });
  
  // Return questions without correct answers
  const quizQuestions = selectedQuestions.map((q, index) => ({
    id: index + 1,
    question: q.question,
    options: q.options,
    type: q.type || 'multiple-choice'
  }));
  
  return {
    quizId,
    topic,
    totalQuestions: 10,
    questions: quizQuestions,
    timeLimit: 600 // 10 minutes in seconds
  };
}

/**
 * Submit quiz answers and calculate score
 */
export const submitQuizAnswers = async (quizId, userAnswers, userId) => {
  const quiz = activeQuizzes.get(quizId);
  
  if (!quiz) {
    throw new Error('Quiz not found or expired');
  }
  
  let correctCount = 0;
  const results = [];
  
  quiz.questions.forEach((question, index) => {
    const userAnswer = userAnswers[index + 1];
    const isCorrect = userAnswer === question.correctAnswer;
    
    if (isCorrect) correctCount++;
    
    results.push({
      questionId: index + 1,
      question: question.question,
      userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      explanation: question.explanation
    });
  });
  
  const score = (correctCount / quiz.questions.length) * 100;
  
  const result = {
    quizId,
    topic: quiz.topic,
    score: Math.round(score),
    correctAnswers: correctCount,
    totalQuestions: quiz.questions.length,
    results,
    completedAt: Date.now()
  };
  
  // Store result in database
  if (userId) {
    console.log('Storing quiz result for userId:', userId);
    try {
      const quizResultDoc = new QuizResult({
        userId,
        quizId: result.quizId,
        topic: result.topic,
        score: result.score,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        results: result.results,
        completedAt: new Date(result.completedAt)
      });
      
      await quizResultDoc.save();
      console.log('Quiz result saved to database');
    } catch (error) {
      console.error('Error saving quiz result to database:', error);
      // Don't throw error, just log it - we still want to return the result
    }
  } else {
    console.log('No userId provided, not storing result');
  }
  
  return result;
};

/**
 * Get user's quiz history from database
 */
export const getQuizHistory = async (userId) => {
  console.log('Getting quiz history for userId:', userId);
  try {
    const history = await QuizResult.find({ userId })
      .sort({ completedAt: -1 })
      .lean();
    
    console.log('Found', history.length, 'quizzes for user from database');
    return history;
  } catch (error) {
    console.error('Error fetching quiz history from database:', error);
    return [];
  }
};

/**
 * Delete a specific quiz from user's history
 */
export const deleteQuiz = async (userId, quizId) => {
  console.log('Deleting quiz:', quizId, 'for user:', userId);
  
  try {
    const result = await QuizResult.deleteOne({ userId, quizId });
    
    if (result.deletedCount === 0) {
      throw new Error('Quiz not found in history');
    }
    
    const remaining = await QuizResult.countDocuments({ userId });
    console.log('Quiz deleted. Remaining quizzes:', remaining);
    
    return { deleted: true, remaining };
  } catch (error) {
    console.error('Error deleting quiz from database:', error);
    throw error;
  }
};

/**
 * Clear all quiz history for a user
 */
export const clearQuizHistory = async (userId) => {
  console.log('Clearing all quiz history for user:', userId);
  
  try {
    const result = await QuizResult.deleteMany({ userId });
    const count = result.deletedCount;
    
    console.log('Cleared', count, 'quizzes for user');
    return { cleared: count };
  } catch (error) {
    console.error('Error clearing quiz history from database:', error);
    throw error;
  }
};

// Clean up expired quizzes (older than 1 hour)
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  for (const [quizId, quiz] of activeQuizzes.entries()) {
    if (now - quiz.createdAt > oneHour) {
      activeQuizzes.delete(quizId);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes
