export default function Comment({ name, email, body }) {
  return (
    <li>
      <p style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 0 }}>{name}</p>
      <p style={{ color: 'grey', margin: 0 }}>{email}</p>
      {body}
    </li>
  );
}
