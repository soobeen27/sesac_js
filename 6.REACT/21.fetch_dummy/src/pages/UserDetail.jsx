import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { fetchUserById } from '../api/dummyUsersApi';

export default function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserById(userId).then((data) => {
      setUser(data);
      setLoading(false);
    });
    // return setLoading(true);
  }, [userId]);

  if (loading) return <p>Loading..</p>;
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
      </div>
    </div>
  );
}
