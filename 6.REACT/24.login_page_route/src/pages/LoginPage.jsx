import { useNavigate } from 'react-router-dom';

import LoginForm from '../components/LoginForm';
import { useLoginForm } from '../hooks/useLoginForm';
import { useAuth } from '../auth/AuthProvider';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const { form, message, canSubmit, updateField, submit, idRef, pwRef } = useLoginForm();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await submit();
            if (!user) return;
            login(user);
            navigate('/profile');
        } catch (err) {
            console.log(err);
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
