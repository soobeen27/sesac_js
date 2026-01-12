export default function TextInput({ label, name, type = 'text', value, onChange, inputref = null }) {
  return (
    <label style={{ display: 'grid', gap: 10 }}>
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(name, e.target.value)} ref={inputref}></input>
    </label>
  );
}
