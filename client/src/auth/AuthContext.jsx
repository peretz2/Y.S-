import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authed | anon

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setStatus('authed');
      return data.user;
    } catch (_err) {
      setUser(null);
      setStatus('anon');
      return null;
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
    setStatus('authed');
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch (_e) { /* no-op */ }
    setUser(null);
    setStatus('anon');
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
