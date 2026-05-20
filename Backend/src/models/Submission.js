const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Exam',
    required: true
  },
  studentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'auto-submitted', 'completed'],
    default: 'in-progress'
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Question',
      required: true
    },
    // MCQ option text, Descriptive text, or raw Code
    answerText: {
      type: String,
      default: ''
    },
    savedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Proctoring data
  tabSwitchViolations: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: null // Null until graded
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
