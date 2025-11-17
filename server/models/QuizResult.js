import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  quizId: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  results: [{
    questionId: Number,
    question: String,
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    explanation: String
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
quizResultSchema.index({ userId: 1, completedAt: -1 });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;
