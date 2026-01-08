import TextInput from './TextInput';

interface LoginFormProps {
    form: { id: string; pw: string };
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onChange: (name: string, value: string) => void;
    message: string;
}

export default function LoginForm({ form, onSubmit, onChange, message }: LoginFormProps) {
    return (
        <form onSubmit={onSubmit}>
            <TextInput label="아이디" name="id" value={form.id} onChange={onChange} />
            <TextInput label="비밀번호" name="pw" type="password" value={form.pw} onChange={onChange} />
            <button type="submit">login</button>
            {message && <div>{message}</div>}
        </form>
    );
}
