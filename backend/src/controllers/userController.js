const User = require('../models/User');

// @desc    Follow or unfollow a user
// @route   POST /api/users/follow/:id
// @access  Private
const followUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const me = await User.findById(req.user._id);

    const isFollowing = me.following.includes(req.params.id);

    if (isFollowing) {
      me.following = me.following.filter((id) => id.toString() !== req.params.id);
      target.followers = target.followers.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      me.following.push(req.params.id);
      target.followers.push(req.user._id);
    }

    await me.save();
    await target.save();

    res.json({ following: !isFollowing, followersCount: target.followers.length });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search users by name or skills
// @route   GET /api/users/search?q=...
// @access  Public
const searchUsers = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.json([]);

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { skills: { $elemMatch: { $regex: q, $options: 'i' } } },
        { bio: { $regex: q, $options: 'i' } },
      ],
    })
      .select('-password')
      .limit(20);

    res.json(users);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users (for explore page)
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(users);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { followUser, searchUsers, getUsers };
