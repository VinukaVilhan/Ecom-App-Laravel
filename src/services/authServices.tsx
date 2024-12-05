import { json } from "stream/consumers";
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from "../types/auth";

const BASE_URL = 'http://127.0.0.1:8000/api';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse>{
        try{
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            return await response.json();

        }catch(error){
            console.log('Login error:', error);
            throw error;
        }
    },

    async register(credentials: RegisterCredentials): Promise<AuthResponse>{
        try{
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
              }
        
              return await response.json();
        }
        catch(error)
        {
            console.error('Registration error:', error);
            throw error;
        }
    },


    async logout(token: string): Promise<void> {
        try {
          const response = await fetch(`${BASE_URL}/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    
          if (!response.ok) {
            throw new Error('Logout failed');
          }
        } catch (error) {
          console.error('Logout error:', error);
          throw error;
        }
      }
};