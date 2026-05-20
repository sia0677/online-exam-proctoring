const Submission = require('../models/Submission');

// @desc    Start an exam attempt
// @route   POST /api/v1/submissions/:examId/start
// @access  Private/Student
exports.startExam = async (req, res, next) => {
  try {
    // Check if already started
    let submission = await Submission.findOne({
      examId: req.params.examId,
      studentId: req.user.id
    });

    if (!submission) {
      submission = await Submission.create({
        examId: req.params.examId,
        studentId: req.user.id,
        status: 'in-progress',
        answers: []
      });
    }

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};

// @desc    Auto-save a specific answer
// @route   PUT /api/v1/submissions/:submissionId/save
// @access  Private/Student
exports.saveAnswer = async (req, res, next) => {
  try {
    const { questionId, answerText, tabSwitchViolations } = req.body;
    const submissionId = req.params.submissionId;

    const submission = await Submission.findById(submissionId);
    
    if (!submission || submission.studentId.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }

    if (submission.status !== 'in-progress') {
      return res.status(400).json({ success: false, error: 'Exam is already submitted' });
    }

    // Update proctoring
    if (tabSwitchViolations) {
      submission.tabSwitchViolations = tabSwitchViolations;
    }

    // Update or add answer
    const existingAnswerIndex = submission.answers.findIndex(a => a.questionId.toString() === questionId);
    if (existingAnswerIndex > -1) {
      submission.answers[existingAnswerIndex].answerText = answerText;
      submission.answers[existingAnswerIndex].savedAt = Date.now();
    } else {
      submission.answers.push({ questionId, answerText });
    }

    await submission.save();

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};

// @desc    Final submit or Auto-submit on timeout
// @route   POST /api/v1/submissions/:submissionId/submit
// @access  Private/Student
exports.submitExam = async (req, res, next) => {
  try {
    const { isAutoSubmit } = req.body;
    
    const submission = await Submission.findById(req.params.submissionId);
    if (!submission || submission.studentId.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }

    submission.status = isAutoSubmit ? 'auto-submitted' : 'completed';
    submission.completedAt = Date.now();
    
    // Auto-grading logic for MCQs would go here in the future
    
    await submission.save();
    
    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};
