import { useEffect, useState } from 'react';
import './App.css';

const KEY = 'theme_dark';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(KEY);
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem(KEY, String(darkMode));
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return (
    <div className="page">
      <div className="card">
        <h2>테마 설정</h2>
        <label className="row">
          <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
          다크모드
        </label>
        <p className="muted">현재 상태: {darkMode ? 'ON' : 'OFF'}</p>
        <button className="btn" onClick={() => alert('work')}>
          버튼 예시
        </button>
      </div>
    </div>
  );
}

export default App;
