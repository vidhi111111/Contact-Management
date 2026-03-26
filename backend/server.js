require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const contactRoutes = require('./routes/contactRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin,
    // Browsers block `credentials: true` when `Access-Control-Allow-Origin` is "*".
    credentials: corsOrigin !== '*',
  })
);

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Contact Management API is running.' });
});

// Routes
app.use('/contacts', contactRoutes);

// Serve frontend from backend/dist (Render single-URL deployment).
const frontendPath = path.join(__dirname, 'dist');
const indexPath = path.join(frontendPath, 'index.html');

console.log('Serving frontend from:', frontendPath);

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  // Wildcard route to support React Router / client-side routing.
  app.get('*', (req, res, next) => {
    // Let API routes go to their handlers.
    if (req.path.startsWith('/contacts') || req.path.startsWith('/api')) return next();

    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }

    return res.status(404).json({
      message: 'Frontend build not found. Make sure backend/dist/index.html exists.',
    });
  });
} else {
  console.error('Frontend build directory missing at startup:', frontendPath);
}

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

async function startServer() {
  console.log('MONGO_URI:', process.env.MONGO_URI ? 'Exists' : 'Missing');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }

  app.listen(process.env.PORT || 5000, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${process.env.PORT || 5000}`);
  });
}

startServer().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err?.message || err);
  process.exit(1);
});

