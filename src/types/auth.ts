// types/auth.ts
export interface User {
    id: number;
    name: string;
    email: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials extends LoginCredentials {
    name: string;
    password_confirmation: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }