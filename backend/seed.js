require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Post = require('./src/models/Post');

const users = [
  {
    name: 'John Carter',
    email: 'john@devcollab.io',
    password: 'demo1234',
    bio: 'Full stack dev obsessed with clean APIs and fast UIs. Building in public.',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    github: 'github.com/johncarter',
  },
  {
    name: 'Jane Smith',
    email: 'jane@devcollab.io',
    password: 'demo1234',
    bio: 'Frontend engineer. I care deeply about accessibility and design systems.',
    skills: ['React', 'Tailwind CSS', 'Figma', 'Next.js'],
    github: 'github.com/janesmith',
  },
  {
    name: 'Alex Morgan',
    email: 'alex@devcollab.io',
    password: 'demo1234',
    bio: 'Backend engineer. Go and Node.js by day, open source by night.',
    skills: ['Node.js', 'Go', 'PostgreSQL', 'Docker', 'Redis'],
    github: 'github.com/alexmorgan',
  },
];

const getPosts = (userDocs) => [
  {
    user: userDocs[0]._id,
    content: `Just shipped v2 of my personal dashboard — rewrote the entire backend in Express with proper error handling, JWT refresh tokens, and rate limiting. Took two weeks but it's finally solid. Lesson learned: don't skip the boring stuff. The boring stuff IS the product.`,
    tags: ['nodejs', 'express', 'backend', 'jwt'],
  },
  {
    user: userDocs[1]._id,
    content: `Hot take: most developer portfolios are too focused on showing off tech stacks and not enough on showing problem-solving. Recruiters don't care if you used Redux or Zustand — they care if you can think through a problem and ship something that works. Your README matters more than your dependencies.`,
    tags: ['career', 'portfolio', 'devlife'],
  },
  {
    user: userDocs[2]._id,
    content: `Been migrating a side project from REST to a cleaner architecture — separating controllers, services, and data layers properly. The difference in testability is night and day. If your controller is doing database queries directly, that's tech debt waiting to explode. Service layer is not optional.`,
    tags: ['architecture', 'nodejs', 'backend', 'cleancode'],
  },
  {
    user: userDocs[0]._id,
    content: `Anyone else find that the best way to learn a new framework is to rebuild something you've already built? No tutorial fatigue, no toy apps — just real decisions. Currently rebuilding my auth system in Next.js App Router after doing it three times in Express. Each time you spot something you missed before.`,
    tags: ['nextjs', 'learning', 'react', 'auth'],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing seed users/posts if re-running
    const emails = users.map((u) => u.email);
    const existingUsers = await User.find({ email: { $in: emails } });
    if (existingUsers.length) {
      const ids = existingUsers.map((u) => u._id);
      await Post.deleteMany({ user: { $in: ids } });
      await User.deleteMany({ _id: { $in: ids } });
      console.log('Cleared previous seed data');
    }

    // Create users (password hashing handled by pre-save hook)
    const createdUsers = await User.insertMany(
      await Promise.all(
        users.map(async (u) => ({
          ...u,
          password: await bcrypt.hash(u.password, 10),
        }))
      ),
      { timestamps: true }
    );
    console.log(`Created ${createdUsers.length} users`);

    // Create posts
    const posts = getPosts(createdUsers);
    await Post.insertMany(posts);
    console.log(`Created ${posts.length} posts`);

    console.log('\nSeed complete! Demo accounts:');
    users.forEach((u) => console.log(`  ${u.email} / ${u.password}`));

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
