
"use client";
import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Navbar from '@/app/components/navbar';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { adminLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Password strength check
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await adminLogin(email, password);
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
            <h2 className="card-title text-center justify-center mb-4">Admin Login</h2>
            
            {error && (
                <div role="alert" className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Email</span>
                </label>
                <input 
                    type="email" 
                    placeholder="Admin Email" 
                    className="input input-bordered w-full" 
                    value={email}
                    onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                    }}
                    required
                />
                </div>

                <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Password</span>
                </label>
                <input 
                    type="password" 
                    placeholder="Password" 
                    className="input input-bordered w-full" 
                    value={password}
                    onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                    }}
                    required
                />
                </div>

                <div className="form-control mt-6">
                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Admin Login'}
                </button>
                </div>
                <div className="text-center mt-4">
                  <p>
                    Are you an User? {' '}
                    <a href="/pages/login" className="link link-primary">
                      User Login
                    </a>
                  </p>
                </div>
            </form>
            </div>
        </div>
        </div>
    </>
  );
}