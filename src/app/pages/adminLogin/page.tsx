'use client';
import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { adminLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminLogin(email, password);
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email"
                required
            />
            <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Admin Login</button>
        </form>
    );
}