import { apiFetch } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  login: (credentials: LoginCredentials) => {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  verifyToken: () => {
    return apiFetch('/auth/verify', {
      method: 'GET',
    });
  }
};