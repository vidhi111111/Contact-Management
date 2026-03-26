import axios from 'axios';

// Vite automatically inlines environment variables starting with `VITE_`.
// For production single-URL deployments (backend serves frontend), leave this empty to use same-origin.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export async function getContacts() {
  const res = await api.get('/contacts');
  return res.data?.data ?? [];
}

export async function createContact(contact) {
  const res = await api.post('/contacts', contact);
  return res.data?.data;
}

export async function updateContact(id, contact) {
  const res = await api.put(`/contacts/${id}`, contact);
  return res.data?.data;
}

export async function deleteContact(id) {
  await api.delete(`/contacts/${id}`);
}

