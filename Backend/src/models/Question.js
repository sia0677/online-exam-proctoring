const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Exam',
    required: true
  },
  type: {
    type: String,
    enum: ['MCQ', 'Coding', 'Descriptive'],
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please add the question text']
  },
  // Only for MCQ
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  // For per-question timer feature
  timeLimitSeconds: {
    type: Number,
    default: 0 // 0 means no individual time limit
  },
  marks: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
