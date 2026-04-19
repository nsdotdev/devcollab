const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostsByUser,
  createPost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.get('/user/:userId', getPostsByUser);
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);
router.post('/like/:id', protect, likePost);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;
