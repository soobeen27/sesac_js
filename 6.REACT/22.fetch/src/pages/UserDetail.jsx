import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { fetchUserById, deleteUserById } from '../api/usersApi';

export default function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserById(userId)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setLoading(false);
      });
    // return setLoading(true);
  }, [userId]);

  async function deleteMe() {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteUserById(userId);
      navigate(-1);
    } catch (err) {
      alert(`error: ${err.message || '삭제에 실패했습니다.'}`);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <p>Loading..</p>;
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
      <h1>User Detail</h1>
      <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 10 }}>
        <div>
          <b>ID</b> : {user.id}
        </div>
        <div>
          <b>NAME</b> : {user.name}
        </div>
        <div>
          <b>EMAIL</b> : {user.email}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        {/* or */}
        <Link to="/users">Users 목록으로</Link>
        <button onClick={deleteMe} disabled={deleting}>
          {deleting ? '삭제중...' : '삭제'}
        </button>
      </div>
    </div>
  );
}
