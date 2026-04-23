require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Post = require('./src/models/Post');

const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@devcollab.io',
    password: 'demo1234',
    bio: 'Python developer passionate about data science and machine learning.',
    skills: ['Python', 'Django', 'PostgreSQL', 'Machine Learning'],
    github: 'github.com/alicejohnson',
  },
  {
    name: 'Bob Wilson',
    email: 'bob@devcollab.io',
    password: 'demo1234',
    bio: 'Java backend developer with a focus on microservices.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
    github: 'github.com/bobwilson',
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@devcollab.io',
    password: 'demo1234',
    bio: 'Full-stack developer using MERN stack.',
    skills: ['MongoDB', 'Express', 'React', 'Node.js'],
    github: 'github.com/charliebrown',
  },
  {
    name: 'Diana Prince',
    email: 'diana@devcollab.io',
    password: 'demo1234',
    bio: 'Frontend specialist with expertise in Vue.js and UI/UX.',
    skills: ['Vue.js', 'JavaScript', 'CSS', 'Figma'],
    github: 'github.com/dianaprince',
  },
  {
    name: 'Ethan Hunt',
    email: 'ethan@devcollab.io',
    password: 'demo1234',
    bio: 'DevOps engineer automating deployments and infrastructure.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    github: 'github.com/ethanhunt',
  },
  {
    name: 'Fiona Green',
    email: 'fiona@devcollab.io',
    password: 'demo1234',
    bio: 'Mobile app developer for iOS and Android.',
    skills: ['Swift', 'Kotlin', 'React Native', 'Firebase'],
    github: 'github.com/fionagreen',
  },
  {
    name: 'George Lucas',
    email: 'george@devcollab.io',
    password: 'demo1234',
    bio: 'Game developer creating immersive experiences.',
    skills: ['Unity', 'C#', 'Blender', 'Unreal Engine'],
    github: 'github.com/georgelucas',
  },
  {
    name: 'Hannah Montana',
    email: 'hannah@devcollab.io',
    password: 'demo1234',
    bio: 'Cybersecurity expert protecting digital assets.',
    skills: ['Penetration Testing', 'Network Security', 'Python', 'Kali Linux'],
    github: 'github.com/hannahmontana',
  },
  {
    name: 'Ian Fleming',
    email: 'ian@devcollab.io',
    password: 'demo1234',
    bio: 'Blockchain developer working on decentralized applications.',
    skills: ['Solidity', 'Ethereum', 'Web3.js', 'Smart Contracts'],
    github: 'github.com/ianfleming',
  },
  {
    name: 'Julia Roberts',
    email: 'julia@devcollab.io',
    password: 'demo1234',
    bio: 'AI researcher exploring natural language processing.',
    skills: ['Python', 'TensorFlow', 'NLP', 'Deep Learning'],
    github: 'github.com/juliaroberts',
  },
];

const getPosts = (userDocs) => [
  {
    user: userDocs[0]._id,
    content: `Excited to share my latest project: a data visualization tool built with Python and Django. It handles large datasets efficiently and provides interactive charts. The key was optimizing the queries and using caching.`,
    tags: ['python', 'django', 'data-visualization', 'caching'],
  },
  {
    user: userDocs[1]._id,
    content: `Just finished implementing microservices architecture for a client app. Spring Boot made it straightforward, but the real challenge was service discovery and communication. Kubernetes helped a lot.`,
    tags: ['java', 'spring-boot', 'microservices', 'kubernetes'],
  },
  {
    user: userDocs[2]._id,
    content: `MERN stack is powerful for rapid prototyping. Just built a social media clone with real-time chat using Socket.io. The hardest part was managing state across components.`,
    tags: ['mern', 'react', 'nodejs', 'socket.io'],
  },
  {
    user: userDocs[3]._id,
    content: `Vue.js components are so reusable! Created a design system for our team that includes buttons, modals, and forms. Accessibility was a priority, using ARIA labels and keyboard navigation.`,
    tags: ['vue.js', 'ui/ux', 'accessibility', 'design-system'],
  },
  {
    user: userDocs[4]._id,
    content: `Automated our entire CI/CD pipeline with Terraform and AWS. From code commit to deployment in under 5 minutes. Monitoring with CloudWatch is crucial for catching issues early.`,
    tags: ['devops', 'aws', 'terraform', 'ci/cd'],
  },
  {
    user: userDocs[5]._id,
    content: `Cross-platform mobile apps are the future. Using React Native for a fitness tracker app. Firebase for backend is seamless, but handling offline sync was tricky.`,
    tags: ['react-native', 'mobile', 'firebase', 'offline-sync'],
  },
  {
    user: userDocs[6]._id,
    content: `Developing games in Unity is addictive. Just added physics-based puzzles to my indie game. C# scripting with Unity's API is powerful, but performance optimization is key.`,
    tags: ['unity', 'c#', 'game-development', 'physics'],
  },
  {
    user: userDocs[7]._id,
    content: `Conducted a penetration test on a web app today. Found SQL injection vulnerabilities. Always remember to sanitize inputs and use prepared statements. Security first!`,
    tags: ['cybersecurity', 'penetration-testing', 'sql-injection', 'security'],
  },
  {
    user: userDocs[8]._id,
    content: `Smart contracts on Ethereum are fascinating. Built a decentralized voting system. Solidity requires careful gas optimization to keep costs down.`,
    tags: ['blockchain', 'ethereum', 'solidity', 'smart-contracts'],
  },
  {
    user: userDocs[9]._id,
    content: `NLP models are getting so advanced. Fine-tuned a BERT model for sentiment analysis. TensorFlow made it easy, but training on large datasets requires good hardware.`,
    tags: ['ai', 'nlp', 'tensorflow', 'bert'],
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
