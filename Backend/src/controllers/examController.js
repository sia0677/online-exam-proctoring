const Exam = require('../models/Exam');
const Question = require('../models/Question');

// @desc    Create new exam
// @route   POST /api/v1/exams
// @access  Private/Admin
exports.createExam = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const exam = await Exam.create(req.body);
    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

// @desc    Add question to exam
// @route   POST /api/v1/exams/:examId/questions
// @access  Private/Admin
exports.addQuestion = async (req, res, next) => {
  try {
    req.body.examId = req.params.examId;
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all exams
// @route   GET /api/v1/exams
// @access  Private
exports.getExams = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'admin') {
      query.createdBy = req.user.id;
    } else {
      query.status = 'published';
    }
    const exams = await Exam.find(query).populate('createdBy', 'name email').sort({ scheduledAt: 1 });
    res.status(200).json({ success: true, count: exams.length, data: exams });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single exam by ID (without questions)
// @route   GET /api/v1/exams/:id
// @access  Private
exports.getExamById = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('createdBy', 'name email');
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }
    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

// @desc    Get exam with questions
// @route   GET /api/v1/exams/:id/questions
// @access  Private
exports.getExamWithQuestions = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('createdBy', 'name email');
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }
    const questions = await Question.find({ examId: req.params.id });
    res.status(200).json({ success: true, data: { exam, questions } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update exam
// @route   PUT /api/v1/exams/:id
// @access  Private/Admin
exports.updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }
    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete exam
// @route   DELETE /api/v1/exams/:id
// @access  Private/Admin
exports.deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }
    await Question.deleteMany({ examId: req.params.id });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
