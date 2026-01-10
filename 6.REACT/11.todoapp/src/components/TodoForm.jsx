export default function TodoForm({ setText, onAdd, text }) {
  return (
    <form onSubmit={onAdd} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
      <input type="text" placeholder="할일 입력" onChange={(e) => setText(e.target.value)} value={text} />
      <button type="submit">추가</button>
    </form>
  );
}
