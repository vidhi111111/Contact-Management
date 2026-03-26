require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const contactRoutes = require('./routes/contactRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const connectDB = require('./config/db');

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
app.get('/', (req, res) => {
  res.json({ message: 'Contact Management API is running.' });
});

// Routes
app.use('/contacts', contactRoutes);

// Serve frontend (single-URL deployment)
// Build the frontend first (frontend/dist) then backend will serve it.
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDistPath));

// Wildcard route to support React Router / client-side routing.
app.get('*', (req, res, next) => {
  // If request looks like an API/static file miss, let error handler handle it.
  if (req.path.startsWith('/contacts')) return next();
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

async function startServer() {
  const PORT = process.env.PORT || 5000;
  await connectDB();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err?.message || err);
  process.exit(1);
});

