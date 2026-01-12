import TextInput from './TextInput';
export default function LoginForm({ form, onChange, onSubmit, message, canSubmit, idRef, pwRef }) {
  const boxStyle = { padding: 10, border: '1px solid #ddd', borderRadius: 10 };
  const messageStyle =
    message.type === 'success'
      ? { ...boxStyle, borderColor: 'rgb(53, 229, 26)', background: 'rgb(190, 240, 149)' }
      : message.type === 'error'
      ? { ...boxStyle, borderColor: 'rgb(230, 23, 54)', background: 'rgb(249, 145, 119)' }
      : message.type === 'failure'
      ? { ...boxStyle, borderColor: 'rgb(251, 165, 165)', background: 'rgb(242, 202, 202)' }
      : boxStyle;
  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
      <TextInput label="아이디" name="id" value={form.id} onChange={onChange} inputref={idRef} />
      <TextInput label="비밀번호" name="pw" type="password" value={form.pw} onChange={onChange} inputref={pwRef} />
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" checked={form.rememberId} onChange={(e) => onChange('rememberId', e.target.checked)} />
        아이디 저장
      </label>
      <button type="submit" disabled={!canSubmit}>
        로그인
      </button>
      {message.text && <div style={messageStyle}>{message.text}</div>}
    </form>
  );
}
