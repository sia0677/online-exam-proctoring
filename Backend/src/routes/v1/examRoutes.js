const express = require('express');
const {
  createExam, addQuestion, getExams, getExamById,
  getExamWithQuestions, updateExam, deleteExam
} = require('../../controllers/examController');
const { protect, authorize } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getExams)
  .post(authorize('admin'), createExam);

router.route('/:id')
  .get(getExamById)
  .put(authorize('admin'), updateExam)
  .delete(authorize('admin'), deleteExam);

router.route('/:id/questions')
  .get(getExamWithQuestions)
  .post(authorize('admin'), addQuestion);

module.exports = router;
