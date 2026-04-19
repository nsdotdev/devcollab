const express = require('express');
const router = express.Router();
const { followUser, searchUsers, getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getUsers);
router.get('/search', searchUsers);
router.post('/follow/:id', protect, followUser);

module.exports = router;
