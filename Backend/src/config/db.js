const mongoose = require('mongoose');
const autoSeed = require('../utils/autoSeeder');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/online_exam_portal');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed if database is empty
    await autoSeed();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
