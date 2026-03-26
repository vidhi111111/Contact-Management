import { useEffect, useState } from 'react';

export default function ContactForm({
  initialValues,
  resetSignal,
  submitLabel,
  isSubmitting,
  onSubmit,
}) {
  const [name, setName] = useState(initialValues?.name || '');
  const [email, setEmail] = useState(initialValues?.email || '');
  const [phone, setPhone] = useState(initialValues?.phone || '');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setName(initialValues?.name || '');
    setEmail(initialValues?.email || '');
    setPhone(initialValues?.phone || '');
    setFormError('');
  }, [initialValues, resetSignal]);

  function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (!name || !email || !phone) {
      setFormError('Please fill out name, email, and phone.');
      return;
    }

    onSubmit({ name, email, phone });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          placeholder="e.g. Alex Johnson"
          required
        />
      </div>

      <div className="row">
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          placeholder="e.g. alex@email.com"
          required
        />
      </div>

      <div className="row">
        <label>Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isSubmitting}
          placeholder="e.g. +1 555 0100"
          required
        />
      </div>

      {formError ? <div className="message error">{formError}</div> : null}

      <div className="actions">
        <button className="btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

