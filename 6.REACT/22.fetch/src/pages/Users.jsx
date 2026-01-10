import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteUserById, fetchUsers } from '../api/usersApi';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    // fetchUsers({ signal: controller.signal })
    fetchUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, []); //최초 1회 실행

  async function deleteUser(id) {
    if (deletingId !== null) return;
    setDeletingId(id);
    try {
      await deleteUserById();
      setUsers((p) => p.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (errorMsg) {
    return (
      <div>
        <h1>Users</h1>
        <p style={{ color: 'crimson' }}>Error: {errorMsg}</p>
        <button onClick={() => window.location.reload()}>새로고침</button>
      </div>
    );
  }
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((u) => {
          const isDeleting = deletingId === u.id;
          return (
            <li key={u.id}>
              <Link to={`/users/${u.id}`}>{u.name}</Link>
              <button style={{ marginLeft: 8 }} onClick={() => deleteUser(u.id)} disabled={deletingId != null}>
                {isDeleting ? '삭제중..' : '삭제'}
              </button>
            </li>
          );
        })}
      </ul>
      {users.length === 0 && <p style={{ color: 'gray' }}>표시할 사용자가 없음</p>}
    </div>
  );
}
