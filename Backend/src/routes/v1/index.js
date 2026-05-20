const express = require('express');
const authRoutes = require('./authRoutes');
const examRoutes = require('./examRoutes');
const submissionRoutes = require('./submissionRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/exams', examRoutes);
router.use('/submissions', submissionRoutes);
router.use('/users', userRoutes);

module.exports = router;
