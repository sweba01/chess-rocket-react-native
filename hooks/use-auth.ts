import { useCallback, useMemo, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export function useAuth(): {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
} {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string) => {
    // Simulate a brief async login
    setTimeout(() => {
      setUser({
        id: 1,
        name: email.split('@')[0],
        email,
      });
    }, 500);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const isLoggedIn = useMemo(() => user !== null, [user]);

  return { user, isLoggedIn, login, logout };
}
