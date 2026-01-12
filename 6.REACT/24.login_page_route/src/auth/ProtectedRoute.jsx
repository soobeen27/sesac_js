import AuthRequiredPage from '../pages/AuthRequiredPage.jsx';

import { useAuth } from './AuthProvider';

export default function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) {
    return <AuthRequiredPage />;
  }
  return children;
}
