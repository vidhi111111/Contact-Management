const mongoose = require('mongoose');

async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error('Missing required environment variable: MONGO_URI');
  }

  try {
    await mongoose.connect(MONGO_URI);
    // eslint-disable-next-line no-console
    console.log('MongoDB Connected');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', err?.message || err);
    throw err;
  }
}

module.exports = connectDB;

