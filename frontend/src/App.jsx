import { useEffect, useMemo, useState } from 'react';

import ContactForm from './components/ContactForm.jsx';
import ContactList from './components/ContactList.jsx';
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from './api/contacts.js';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editingContact, setEditingContact] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formResetSignal, setFormResetSignal] = useState(0);

  const formInitialValues = useMemo(() => {
    if (!editingContact) return { name: '', email: '', phone: '' };
    return {
      name: editingContact.name,
      email: editingContact.email,
      phone: editingContact.phone,
    };
  }, [editingContact]);

  async function refreshContacts() {
    setError('');
    setSuccess('');
    setLoadingContacts(true);
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load contacts.';
      setError(msg);
    } finally {
      setLoadingContacts(false);
    }
  }

  useEffect(() => {
    refreshContacts();
  }, []);

  async function handleSubmit(values) {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (editingContact) {
        await updateContact(editingContact._id, values);
        setSuccess('Contact updated successfully.');
      } else {
        await createContact(values);
        setSuccess('Contact added successfully.');
      }

      setEditingContact(null);
      setFormResetSignal((v) => v + 1);
      await refreshContacts();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Request failed.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm('Are you sure you want to delete this contact?');
    if (!ok) return;

    setDeletingId(id);
    setError('');
    setSuccess('');
    try {
      await deleteContact(id);
      if (editingContact?._id === id) setEditingContact(null);
      setSuccess('Contact deleted successfully.');
      await refreshContacts();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Delete failed.';
      setError(msg);
    } finally {
      setDeletingId(null);
    }
  }

  function handleEdit(contact) {
    setEditingContact(contact);
    setError('');
    setSuccess('');
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 style={{ margin: 0 }}>Contact Manager</h1>
          <p className="subtitle">
            A clean MERN CRUD app (MongoDB Atlas + Express + React).
          </p>
        </div>
        <button type="button" onClick={refreshContacts} disabled={loadingContacts}>
          {loadingContacts ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error ? (
        <div className="message error">
          <strong>Error:</strong> {error}
        </div>
      ) : null}

      {success ? (
        <div className="message success">
          <strong>Success:</strong> {success}
        </div>
      ) : null}

      <div className="grid">
        <section className="card">
          <h2 style={{ marginTop: 0 }}>
            {editingContact ? 'Edit Contact' : 'Add Contact'}
          </h2>

          <ContactForm
            initialValues={formInitialValues}
            resetSignal={formResetSignal}
            submitLabel={editingContact ? 'Save Changes' : 'Add Contact'}
            isSubmitting={submitting}
            onSubmit={handleSubmit}
          />

          {editingContact ? (
            <div className="actions" style={{ marginTop: 10 }}>
              <button
                type="button"
                onClick={() => {
                  setEditingContact(null);
                  setError('');
                  setSuccess('');
                  setFormResetSignal((v) => v + 1);
                }}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          ) : null}
        </section>

        <section className="card">
          <h2 style={{ marginTop: 0 }}>All Contacts</h2>
          {loadingContacts ? <p className="subtitle">Loading contacts...</p> : null}
          <ContactList
            contacts={contacts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        </section>
      </div>
    </div>
  );
}

