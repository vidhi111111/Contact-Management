const Contact = require('../models/Contact');
const asyncHandler = require('../middleware/asyncHandler');

// Basic required-field validation (Mongoose will also validate).
function validateContactBody(body) {
  const { name, email, phone } = body || {};

  if (!name || !email || !phone) {
    return 'name, email, and phone are required.';
  }

  if (typeof name !== 'string' || typeof email !== 'string' || typeof phone !== 'string') {
    return 'name, email, and phone must be strings.';
  }

  return null;
}

// GET /contacts
const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json({ message: 'Contacts fetched successfully.', data: contacts });
});

// POST /contacts
const createContact = asyncHandler(async (req, res) => {
  const validationError = validateContactBody(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const { name, email, phone } = req.body;
  const created = await Contact.create({ name, email, phone });
  res.status(201).json({ message: 'Contact created successfully.', data: created });
});

// PUT /contacts/:id
const updateContact = asyncHandler(async (req, res) => {
  const validationError = validateContactBody(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const { name, email, phone } = req.body;
  const updated = await Contact.findByIdAndUpdate(
    req.params.id,
    { name, email, phone },
    { new: true, runValidators: true }
  );

  if (!updated) return res.status(404).json({ message: 'Contact not found.' });
  res.json({ message: 'Contact updated successfully.', data: updated });
});

// DELETE /contacts/:id
const deleteContact = asyncHandler(async (req, res) => {
  const deleted = await Contact.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Contact not found.' });

  res.json({ message: 'Contact deleted successfully.' });
});

module.exports = {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
};

