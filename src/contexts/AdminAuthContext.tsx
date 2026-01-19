import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'admin_authenticated';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string): boolean => {
    // VITE_ADMIN_PASSWORD is optional - access it safely
    const adminPassword = (import.meta.env as { VITE_ADMIN_PASSWORD?: string }).VITE_ADMIN_PASSWORD;

    if (!adminPassword) {
      // If admin password is not configured, allow access with any password
      // This is intentional to allow the feature to work without configuration
      // In production, you should set VITE_ADMIN_PASSWORD
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }

    if (password === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
