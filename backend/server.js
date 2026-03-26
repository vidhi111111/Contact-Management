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

// Serve frontend (single-URL deployment)
// Render build may output dist (Vite) or build (CRA); support both.
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
const frontendPath = fs.existsSync(frontendDistPath)
  ? frontendDistPath
  : frontendBuildPath;
app.use(express.static(frontendPath));

// Wildcard route to support React Router / client-side routing.
app.get('*', (req, res, next) => {
  // If request looks like an API/static file miss, let error handler handle it.
  if (req.path.startsWith('/contacts') || req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendPath, 'index.html'));
});

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

