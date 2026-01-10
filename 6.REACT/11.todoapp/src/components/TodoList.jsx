export default function TodoList({ todos, onToggle, onRemove }) {
  return (
    <ul style={{ marginTop: 12, paddingLeft: 16 }}>
      {todos.map((t) => (
        <li key={t.id} style={{ marginTop: 12, paddingLeft: 8 }}>
          <input
            type="checkbox"
            checked={t.done}
            onChange={() => {
              onToggle(t.id);
            }}
          />
          <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
          <button
            style={{ marginLeft: 'auto' }}
            onClick={() => {
              onRemove(t.id);
            }}
          >
            삭제
          </button>
        </li>
      ))}
    </ul>
  );
}
