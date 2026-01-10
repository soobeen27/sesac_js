import { useEffect } from 'react';
import { useState } from 'react';

function App() {
  const [keyword, setKeyword] = useState('');
  const [users, setUsers] = useState([]);
  1;

  useEffect(() => {
    if (!keyword) {
      setUsers([]);
      1;
      return;
    }
    const timer = setTimeout(() => {
      fetch('https://jsonplaceholder.typicode.com/users')
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((u) => u.name.toLowerCase().includes(keyword.toLowerCase()));
          setUsers(filtered);
        });
      setUsers([`"${keyword}" 검색결과`]);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  return (
    <div>
      <input
        value={keyword}
        type="text"
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
        placeholder="검색어 입력"
      />
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
