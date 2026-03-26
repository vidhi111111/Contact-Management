function notFound(req, res, next) {
  res.status(404).json({ message: 'Route not found' });
}

function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);

  const isProd = process.env.NODE_ENV === 'production';
  const base = { message: err?.message || 'Server error' };

  // Mongoose validation errors
  if (err && err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message || base.message });
  }

  // Invalid MongoDB ObjectId
  if (err && err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid contact id.' });
  }

  // Duplicate key errors (e.g., if you later add unique indexes)
  if (err && err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value error.' });
  }

  return res.status(err?.statusCode || 500).json(
    isProd ? base : { ...base, stack: err?.stack }
  );
}

module.exports = { notFound, errorHandler };

