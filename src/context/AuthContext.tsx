import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id?: string; name?: string; email: string; role?: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id?: string; name?: string; email: string; role?: string } | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('refresh_token');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // ignore parse errors
      }
    }
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const base = (import.meta.env.VITE_REACT_APP_API_BASE_URL as string) || '';

    // In dev, use the Vite proxy by calling a relative path so the browser origin matches dev server.
    const url = import.meta.env.DEV ? '/auth/admin/login' : `${base.replace(/\/$/, '')}/auth/admin/login`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const body = await resp.json().catch(() => null);
    if (!resp.ok) {
      const message = body?.message || 'Login failed';
      throw new Error(message);
    }

    const token = body?.token;
    const userData = body?.user;
    if (!token || !userData) throw new Error('Invalid response from server');

    // Save refresh token and user info
    localStorage.setItem('refresh_token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    setUser({ id: userData.id, email: userData.email, name: userData.email?.split('@')[0], role: userData.role });
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
