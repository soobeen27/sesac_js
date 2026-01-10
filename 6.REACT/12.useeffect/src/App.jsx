import { useState, useEffect } from 'react';
import UserCard from './components/UserCard';
import SearchBar from './components/SearchBar';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const filteredUser = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    console.log('useEffect called');
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>로딩 중...</p>;

  function removeUser(id) {
    setUsers(users.filter((u) => u.id !== id));
  }

  return (
    <>
      <h1>useEffect를 통한 외부 API 요청</h1>
      <h2 className="m-4">사용자 목록</h2>
      <SearchBar keyword={search} onSearch={setSearch} />
      <div className="container pb-4">
        <div className="row">
          {filteredUser.map((u) => (
            <div key={u.id} className="col-md-6 col-lg-4">
              <UserCard user={u} onRemove={removeUser} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
