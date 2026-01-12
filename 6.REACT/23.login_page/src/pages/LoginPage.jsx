import { useState, useMemo, useRef, useEffect } from 'react';
import LoginForm from '../components/LoginForm';

const SAVED_ID_KEY = 'saved_login_id';

function getInitialHome() {
  const savedId = localStorage.getItem(SAVED_ID_KEY) || '';
  return { id: savedId, pw: '', rememberId: Boolean(savedId) };
}

export default function LoginPage() {
  const [form, setForm] = useState(() => getInitialHome()); //애로우 함수 안에 담아야 lazy init
  const [message, setMessage] = useState({ type: '', text: '' });
  const canSubmit = useMemo(() => {
    return form.id.trim() !== '' && form.pw.trim() !== '';
  }, [form.id, form.pw]);

  const idRef = useRef(null);
  const pwRef = useRef(null);

  useEffect(() => {
    if (form.id && form.rememberId) {
      pwRef.current?.focus();
    } else {
      idRef.current?.focus();
    }
  }, [message]);

  useEffect(() => {
    if (message.type !== 'success') return;
    const timer = setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);

    return () => clearTimeout(timer);
  }, [message.type]);

  const updateField = (name, value) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === 'rememberId') {
        if (!value) {
          localStorage.removeItem(SAVED_ID_KEY);
        } else if (prev.id.trim()) {
          localStorage.setItem(SAVED_ID_KEY, prev.id.trim());
        }
      }
      return next;
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const id = form.id.trim();
    const pw = form.pw.trim();
    if (!id || !pw) {
      setMessage('아이디와 비밀번호 모두 입력');
      return;
    }
    // 가상의 아이디 패스워드 체크 로직
    const ok = id === 'admin' && pw === '1234';
    if (ok) {
      if (form.rememberId) localStorage.setItem(SAVED_ID_KEY, id);
      setMessage({ type: 'success', text: '로그인 성공' });
    } else {
      setMessage({ type: 'failure', text: '로그인 실패' });
      setForm((prev) => {
        return { ...prev, pw: '' };
      });
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>로그인</h2>
      <LoginForm
        form={form}
        onChange={updateField}
        onSubmit={handleSubmit}
        message={message}
        canSubmit={canSubmit}
        idRef={idRef}
        pwRef={pwRef}
      />
    </div>
  );
}
