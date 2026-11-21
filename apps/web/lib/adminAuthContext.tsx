'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'EDITOR';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  allowedModules: string[];
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; user?: AdminUser }>;
  logout: () => Promise<void>;
  switchRoleQuick: (role: UserRole) => Promise<void>;
  isLoading: boolean;
  canAccess: (module: string) => boolean;
  isSuperAdmin: boolean;
  isManager: boolean;
  isEditor: boolean;
}

const DEFAULT_SUPER_ADMIN: AdminUser = {
  id: 'usr_admin_01',
  email: 'admin@hastinamotorparts.in',
  name: 'Alisons Executive Admin',
  role: 'SUPER_ADMIN',
  allowedModules: [
    'dashboard',
    'parts',
    'brands',
    'categories',
    'enquiries',
    'import',
    'analytics',
    'users',
    'settings'
  ]
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check current session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const storedUser = localStorage.getItem('hastina_admin_user');
        const storedToken = localStorage.getItem('hastina_admin_token');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setIsLoading(false);
          return;
        }

        // Try server cookie validation
        const res = await fetch('/api/admin/auth/me');
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setToken('cookie_session');
          localStorage.setItem('hastina_admin_user', JSON.stringify(data.user));
          localStorage.setItem('hastina_admin_token', 'cookie_session');
        } else {
          // Default fallback to Super Admin for smooth development access
          setUser(DEFAULT_SUPER_ADMIN);
          setToken('default_session');
          localStorage.setItem('hastina_admin_user', JSON.stringify(DEFAULT_SUPER_ADMIN));
          localStorage.setItem('hastina_admin_token', 'default_session');
        }
      } catch {
        setUser(DEFAULT_SUPER_ADMIN);
        setToken('default_session');
      } finally {
        setIsLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('hastina_admin_user', JSON.stringify(data.user));
        localStorage.setItem('hastina_admin_token', data.token);
        setIsLoading(false);
        return { success: true, user: data.user };
      }
      setIsLoading(false);
      return { success: false, error: data.error || 'Login failed' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('hastina_admin_user');
    localStorage.removeItem('hastina_admin_token');
  };

  // Quick Switch helper for dashboard preview & role testing
  const switchRoleQuick = async (role: UserRole) => {
    let email = 'admin@hastinamotorparts.in';
    let pass = 'Admin@Hastina2026';
    if (role === 'MANAGER') {
      email = 'manager@hastinamotorparts.in';
      pass = 'Manager@Hastina2026';
    } else if (role === 'EDITOR') {
      email = 'editor@hastinamotorparts.in';
      pass = 'Editor@Hastina2026';
    }
    await login(email, pass);
  };

  const canAccess = (module: string): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return user.allowedModules?.includes(module) || false;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        switchRoleQuick,
        isLoading,
        canAccess,
        isSuperAdmin: user?.role === 'SUPER_ADMIN',
        isManager: user?.role === 'MANAGER',
        isEditor: user?.role === 'EDITOR'
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
