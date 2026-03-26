export default function ContactList({
  contacts,
  onEdit,
  onDelete,
  deletingId,
}) {
  if (!contacts || contacts.length === 0) {
    return <p className="subtitle">No contacts yet.</p>;
  }

  return (
    <div>
      <h3>Contacts</h3>
      <ul className="list">
        {contacts.map((c) => (
          <li key={c._id} className="contact">
            <div>
              <strong>{c.name}</strong>
              <div className="meta">{c.email}</div>
              <div className="meta">{c.phone}</div>
            </div>

            <div className="actions" style={{ justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => onEdit(c)}>
                Edit
              </button>
              <button
                className="btn-danger"
                type="button"
                onClick={() => onDelete(c._id)}
                disabled={deletingId === c._id}
              >
                {deletingId === c._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

