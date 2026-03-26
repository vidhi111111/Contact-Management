const router = require('express').Router();

const {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');

// Base path: /contacts
router.get('/', getAllContacts);
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;

