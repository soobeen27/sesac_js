import { useState } from 'react';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
    const [form, setForm] = useState({ id: '', pw: '' });
    const [message, setMessage] = useState('');

    const updateField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
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
        if (ok) setMessage('로그인 성공');
        else {
            setMessage('로그인 실패');
            setForm((prev) => {
                return { ...prev, pw: '' };
            });
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto' }}>
            <h2>로그인</h2>
            <LoginForm form={form} onChange={updateField} onSubmit={handleSubmit} message={message} />
        </div>
    );
}
