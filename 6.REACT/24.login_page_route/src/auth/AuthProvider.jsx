import { useEffect, useState, useContext, createContext, useMemo } from 'react';

const STORAGE_KEY = 'auth_user';
const storage = sessionStorage;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setUser(parsed);
    } catch (e) {
      storage.removeItem(STORAGE_KEY);
      console.log(e);
    }
  }, []);

  const login = (nextUser) => {
    setUser(nextUser);
    console.log(nextUser);
    storage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  };

  const logout = () => {
    setUser(null);
    storage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => {
    return {
      user,
      isAuthed: !!user,
      login,
      logout,
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('접근 불가');
  }
  return ctx;
}
