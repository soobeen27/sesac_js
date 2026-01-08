import { useState } from 'react';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
    const [form, setForm] = useState({ id: '', pw: '' });
    const [message, setMessage] = useState('');

    function upadateField(name: string, value: string) {
        setForm((prev) => {
            return { ...prev, [name]: value };
        });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const id = form.id.trim();
        const pw = form.pw.trim();
        if (!id || !pw) {
            console.log(id, pw);
            setMessage('아이디와 비밀번호 모두 입력');
            return;
        }
        setMessage(`id: ${id} pw: ${pw}`);
    }

    return (
        <main>
            <h1>Login</h1>
            <LoginForm form={form} onChange={upadateField} onSubmit={handleSubmit} message={message} />
        </main>
    );
}
