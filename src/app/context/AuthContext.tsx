'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
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
        if (!token) return;
        
        await fetchUser(); // Validate token and fetch user details
      } catch {
        logout(); // Logout if fetching fails
      }finally{
        setLoading(false);
      }
    };
  
    fetchInitialUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/me', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error: any) {
      setUser(null);
      setIsAuthenticated(false);
      console.error('Failed to fetch user:', error);
      logout();
    }
  };

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      });

      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Registration failed');
      }
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password
      });

      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw error;
    }
  };


  const adminLogin = async(email: string, password: string)=> {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/admin/login', {
        email,
        password
      });

      const {token} = response.data;

      localStorage.setItem('adminToken', token);
      setUser({role: 'admin'});
      setIsAuthenticated(true);
      router.push('/pages/adminDashboard')
    }catch(error: any){
      if(error.response)
      {
        throw new Error(error.response.data.message || 'Admin login failed');
      }
      throw error;
    }

  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
  
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.push('/pages/login');
    }
  };


  const adminLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Send logout request to the backend
      await axios.post('http://127.0.0.1:8000/api/admin/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
  
      // Remove the admin token from local storage
      localStorage.removeItem('adminToken');
      
      // Reset user state
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login page
      router.push('/pages/login');
    } catch (error: any) {
      console.error('Admin logout error:', error);
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
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