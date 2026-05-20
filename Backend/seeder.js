require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Exam = require('./src/models/Exam');
const Question = require('./src/models/Question');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/online_exam_portal');
  console.log('MongoDB Connected for seeding...');
};

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Exam.deleteMany({});
  await Question.deleteMany({});
  console.log('Cleared existing data.');

  // Create admin
  const admin = await User.create({
    name: 'ARVO Admin',
    email: 'admin@arvo.com',
    password: 'admin123',
    role: 'admin'
  });
  console.log(`Admin created: admin@arvo.com / admin123`);

  // Create sample students
  const students = await User.create([
    { name: 'Alice Johnson', email: 'alice@arvo.com', password: 'student123', role: 'student' },
    { name: 'Bob Smith',     email: 'bob@arvo.com',   password: 'student123', role: 'student' },
    { name: 'Carol White',   email: 'carol@arvo.com', password: 'student123', role: 'student' },
    { name: 'David Brown',   email: 'david@arvo.com', password: 'student123', role: 'student' },
    { name: 'Eva Martinez',  email: 'eva@arvo.com',   password: 'student123', role: 'student' },
  ]);
  console.log(`${students.length} students created.`);

  // Create sample exams
  const now = new Date();
  const exam1 = await Exam.create({
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of core JavaScript concepts including closures, promises, and ES6+ features.',
    durationMinutes: 60,
    scheduledAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
    createdBy: admin._id,
    status: 'published'
  });

  const exam2 = await Exam.create({
    title: 'Data Structures & Algorithms',
    description: 'A comprehensive exam covering arrays, linked lists, trees, graphs, sorting and searching algorithms.',
    durationMinutes: 90,
    scheduledAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    createdBy: admin._id,
    status: 'published'
  });

  const exam3 = await Exam.create({
    title: 'Web Development Basics',
    description: 'Evaluate your HTML, CSS, and HTTP knowledge in this foundational web development exam.',
    durationMinutes: 45,
    scheduledAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    createdBy: admin._id,
    status: 'published'
  });

  const exam4 = await Exam.create({
    title: 'React & State Management',
    description: 'Advanced React patterns, hooks, Context API, and Redux state management concepts.',
    durationMinutes: 75,
    scheduledAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
    createdBy: admin._id,
    status: 'draft'
  });

  console.log('4 exams created.');

  // Add questions to exam1 (JavaScript)
  await Question.create([
    {
      examId: exam1._id,
      type: 'MCQ',
      text: 'What is the output of `typeof null` in JavaScript?',
      options: [
        { text: '"null"', isCorrect: false },
        { text: '"object"', isCorrect: true },
        { text: '"undefined"', isCorrect: false },
        { text: '"string"', isCorrect: false }
      ],
      marks: 2
    },
    {
      examId: exam1._id,
      type: 'MCQ',
      text: 'Which method is used to create a Promise that is immediately resolved?',
      options: [
        { text: 'Promise.all()', isCorrect: false },
        { text: 'Promise.reject()', isCorrect: false },
        { text: 'Promise.resolve()', isCorrect: true },
        { text: 'Promise.race()', isCorrect: false }
      ],
      marks: 2
    },
    {
      examId: exam1._id,
      type: 'MCQ',
      text: 'What does the spread operator (...) do in JavaScript?',
      options: [
        { text: 'Creates a new function scope', isCorrect: false },
        { text: 'Expands an iterable into individual elements', isCorrect: true },
        { text: 'Declares a rest parameter', isCorrect: false },
        { text: 'Merges two classes', isCorrect: false }
      ],
      marks: 2
    },
    {
      examId: exam1._id,
      type: 'MCQ',
      text: 'Which of the following is NOT a JavaScript data type?',
      options: [
        { text: 'Symbol', isCorrect: false },
        { text: 'BigInt', isCorrect: false },
        { text: 'Float', isCorrect: true },
        { text: 'Undefined', isCorrect: false }
      ],
      marks: 2
    },
    {
      examId: exam1._id,
      type: 'MCQ',
      text: 'What is a closure in JavaScript?',
      options: [
        { text: 'A way to close a browser tab', isCorrect: false },
        { text: 'A function that retains access to its outer scope variables', isCorrect: true },
        { text: 'A method to end a loop early', isCorrect: false },
        { text: 'A JavaScript class modifier', isCorrect: false }
      ],
      marks: 3
    }
  ]);

  // Add questions to exam2 (DSA)
  await Question.create([
    {
      examId: exam2._id,
      type: 'MCQ',
      text: 'What is the time complexity of binary search on a sorted array?',
      options: [
        { text: 'O(n)', isCorrect: false },
        { text: 'O(n²)', isCorrect: false },
        { text: 'O(log n)', isCorrect: true },
        { text: 'O(1)', isCorrect: false }
      ],
      marks: 2
    },
    {
      examId: exam2._id,
      type: 'MCQ',
      text: 'Which data structure uses LIFO (Last In, First Out) ordering?',
      options: [
        { text: 'Queue', isCorrect: false },
        { text: 'Stack', isCorrect: true },
        { text: 'Tree', isCorrect: false },
        { text: 'Graph', isCorrect: false }
      ],
      marks: 2
    },
    {
      examId: exam2._id,
      type: 'MCQ',
      text: 'What is the worst-case time complexity of Quick Sort?',
      options: [
        { text: 'O(n log n)', isCorrect: false },
        { text: 'O(n)', isCorrect: false },
        { text: 'O(n²)', isCorrect: true },
        { text: 'O(log n)', isCorrect: false }
      ],
      marks: 3
    },
    {
      examId: exam2._id,
      type: 'MCQ',
      text: 'In a Binary Search Tree, where is the minimum value located?',
      options: [
        { text: 'Root node', isCorrect: false },
        { text: 'Right-most node', isCorrect: false },
        { text: 'Left-most node', isCorrect: true },
        { text: 'Random position', isCorrect: false }
      ],
      marks: 2
    }
  ]);

  // Add questions to exam3 (Web Dev)
  await Question.create([
    {
      examId: exam3._id,
      type: 'MCQ',
      text: 'Which HTML tag is used to define an internal stylesheet?',
      options: [
        { text: '<css>', isCorrect: false },
        { text: '<script>', isCorrect: false },
        { text: '<style>', isCorrect: true },
        { text: '<link>', isCorrect: false }
      ],
      marks: 1
    },
    {
      examId: exam3._id,
      type: 'MCQ',
      text: 'What does HTTP stand for?',
      options: [
        { text: 'HyperText Transfer Protocol', isCorrect: true },
        { text: 'High Text Transfer Protocol', isCorrect: false },
        { text: 'HyperText Transmission Protocol', isCorrect: false },
        { text: 'HyperText Transfer Process', isCorrect: false }
      ],
      marks: 1
    },
    {
      examId: exam3._id,
      type: 'MCQ',
      text: 'Which CSS property controls the text size?',
      options: [
        { text: 'text-size', isCorrect: false },
        { text: 'font-size', isCorrect: true },
        { text: 'text-style', isCorrect: false },
        { text: 'font-weight', isCorrect: false }
      ],
      marks: 1
    }
  ]);

  console.log('Questions seeded for all exams.');
  console.log('\n✅ Seeding complete!\n');
  console.log('Login credentials:');
  console.log('  Admin:   admin@arvo.com     / admin123');
  console.log('  Student: alice@arvo.com     / student123');
  console.log('  Student: bob@arvo.com       / student123');
  process.exit(0);
};

seed().catch(err => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
