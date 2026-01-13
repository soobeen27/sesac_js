import { useState } from 'react';
import { api, setToken } from '../api.js';

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block w-full">
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
      <input
        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export default function AuthCard({ onAuthed }) {
  const [mode, setMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMsg('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await api.signup({ email, password, name });
        setMsg('✅ 가입 완료! 이제 로그인 해주세요.');
        setMode('login');
      } else {
        const data = await api.login({ email, password });
        setToken(data.accessToken);
        onAuthed();
      }
    } catch (e) {
      setMsg(`❌ ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">TaskFlow</h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            {mode === 'login' ? '로그인 후 시작하세요' : '간단 가입 후 바로 사용 가능합니다.'}
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
            onClick={() => setMode('login')}
          >
            로그인
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
            onClick={() => setMode('signup')}
          >
            회원가입
          </button>
        </div>

        <div className="space-y-4">
          {mode === 'signup' && <Field label="이름" value={name} onChange={setName} />}
          <Field label="이메일" value={email} onChange={setEmail} />
          <Field label="비밀번호" value={password} onChange={setPassword} type="password" />

          <button
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md shadow-indigo-600/20 disabled:opacity-70"
            onClick={submit}
            disabled={loading}
          >
            {loading ? '처리중...' : mode === 'login' ? '로그인' : '가입하기'}
          </button>

          {msg && (
            <div
              className={`text-sm text-center p-2 rounded ${
                msg.includes('✅') ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'
              }`}
              role="alert"
            >
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
