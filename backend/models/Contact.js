const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => emailRegex.test(v),
        message: 'Invalid email format.',
      },
    },
    phone: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);

