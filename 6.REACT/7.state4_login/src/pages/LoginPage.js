import { useState } from 'react';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
    const [form, setForm] = useState({ id: '', pw: '' });

    const updateField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`id: ${form.id}, pw=${form.pw}`);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto' }}>
            <h2>로그인</h2>
            <LoginForm form={form} onChange={updateField} onSubmit={handleSubmit} />
        </div>
    );
}
