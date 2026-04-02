import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';


interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, _password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const storedUser = localStorage.getItem('jn_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    // Mock Auth Logic
    return new Promise((resolve) => {
      setTimeout(() => {
        let userData: User | null = null;
        if (email === 'admin@jn.com' && password === 'admin123') {
          userData = { id: '1', email, name: 'Admin User', role: 'ADMIN' };
        } else if (email === 'user@jn.com' && password === 'user123') {
          userData = { id: '2', email, name: 'Premium Retailer', role: 'CUSTOMER' };
        }

        if (userData) {
          setUser(userData);
          localStorage.setItem('jn_user', JSON.stringify(userData));
        }
        setLoading(false);
        resolve(userData);
      }, 800);
    });
  };

  const register = async (name: string, email: string, _password: string): Promise<User | null> => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData: User = { id: Math.random().toString(), email, name, role: 'CUSTOMER' };
        setUser(userData);
        localStorage.setItem('jn_user', JSON.stringify(userData));
        setLoading(false);
        resolve(userData);
      }, 1000);
    });
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('jn_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
