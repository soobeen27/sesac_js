import { Link } from 'react-router-dom';
export default function AuthRequiredPage() {
  return (
    <div>
      <h2>로그인 필요</h2>
      <p>
        접근 안됨 <br />
        <Link to="/login">로그인 후 시도</Link>
      </p>
    </div>
  );
}
