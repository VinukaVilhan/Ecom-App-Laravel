'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  adminLogout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

interface CartItem {
  product_id: number;
  quantity: number;
}

const BASE_URL = 'http://127.0.0.1:8000/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInitialUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        await fetchUser();
      } catch {
        await logout();
      } finally {
        setLoading(false);
      }
    };

    fetchInitialUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const userData = await response.json();
    setUser(userData);
    setIsAuthenticated(true);
  };

  const syncCartItems = async (token: string) => {
    const localCartItems = localStorage.getItem('cartItems');
    if (!localCartItems) return;

    const cartItems: CartItem[] = JSON.parse(localCartItems);
    if (cartItems.length === 0) return;

    const response = await fetch(`${BASE_URL}/cart-items/sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: cartItems })
    });

    if (response.ok) {
      localStorage.removeItem('cartItems');
      return await response.json();
    }
    
    throw new Error('Failed to sync cart items');
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const { user, token } = await response.json();
    localStorage.setItem('token', token);
    setUser(user);
    setIsAuthenticated(true);

    await syncCartItems(token);
    router.push('/dashboard');
  };

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const { user, token } = await response.json();
    localStorage.setItem('token', token);
    setUser(user);
    setIsAuthenticated(true);

    await syncCartItems(token);
  };

  const adminLogin = async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Admin login failed');
    }

    const { token } = await response.json();
    localStorage.setItem('adminToken', token);
    setUser({ role: 'admin' });
    setIsAuthenticated(true);
    router.push('/pages/adminDashboard');
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('cartItems');
      setUser(null);
      setIsAuthenticated(false);
      router.push('/pages/login');
    }
  };

  const adminLogout = async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${BASE_URL}/admin/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Logout failed');
    }

    localStorage.removeItem('adminToken');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/pages/login');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, adminLogin, adminLogout, isAuthenticated, loading }}>
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