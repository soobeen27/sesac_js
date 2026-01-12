import { useState, useEffect, useMemo, useRef } from 'react';
import { fetchLogin } from '../api/auth';

const SAVED_ID_KEY = 'saved_login_id';

function getInitialHome() {
    const savedId = localStorage.getItem(SAVED_ID_KEY) || '';
    return { id: savedId, pw: '', rememberId: Boolean(savedId) };
}

export function useLoginForm() {
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
    }, []);

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

    const submit = async () => {
        const id = form.id.trim();
        const pw = form.pw.trim();
        if (!id || !pw) {
            setMessage('아이디와 비밀번호 모두 입력');
            return;
        }
        try {
            const { ok, user } = await fetchLogin({ id, pw });
            if (!ok) throw new Error('로그인에 실패');
            setMessage({ type: 'success', text: '로그인 성공' });
            return user;
        } catch (err) {
            setMessage({ type: 'failure', text: `로그인 실패${err.message || '오류가 발생했습니다.'}` });
            setForm((prev) => {
                return { ...prev, pw: '' };
            });
        }
        if (form.rememberId) localStorage.setItem(SAVED_ID_KEY, id);
    };

    return {
        form,
        message,
        canSubmit,
        updateField,
        submit,
        idRef,
        pwRef,
    };
}
