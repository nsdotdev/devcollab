const Post = require('../models/Post');

const POPULATE_USER = 'name email bio skills github';
const POPULATE_COMMENT_USER = 'name email';

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const tag = req.query.tag?.trim().replace(/^#/, '');

    const query = tag ? { tags: tag } : {};

    const posts = await Post.find(query)
      .populate('user', POPULATE_USER)
      .populate('comments.user', POPULATE_COMMENT_USER)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get posts by user ID
// @route   GET /api/posts/user/:userId
// @access  Public
const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', POPULATE_USER)
      .populate('comments.user', POPULATE_COMMENT_USER)
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { content, tags } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const tagsArray = tags
      ? tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean)
      : [];

    const post = await Post.create({
      user: req.user._id,
      content: content.trim(),
      tags: tagsArray,
    });

    const populated = await post.populate('user', POPULATE_USER);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like / Unlike a post
// @route   POST /api/posts/like/:id
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({ likes: post.likes, liked: !isLiked });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: req.user._id, text: text.trim() });
    await post.save();

    await post.populate('comments.user', POPULATE_COMMENT_USER);

    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json(newComment);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.deleteOne();
    await post.save();

    res.json({ message: 'Comment deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPosts, getPostsByUser, createPost, deletePost, likePost, addComment, deleteComment };
