const express = require('express');
const { startExam, saveAnswer, submitExam } = require('../../controllers/submissionController');
const { protect } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/:examId/start', startExam);
router.put('/:submissionId/save', saveAnswer);
router.post('/:submissionId/submit', submitExam);

module.exports = router;
