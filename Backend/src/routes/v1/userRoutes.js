const express = require('express');
const { getUsers, getUserById, deleteUser } = require('../../controllers/userController');
const { protect, authorize } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getUsers);
router.route('/:id').get(getUserById).delete(deleteUser);

module.exports = router;
