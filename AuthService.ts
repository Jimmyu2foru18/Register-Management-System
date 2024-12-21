import api from './api';
import { User } from '../types';

export const AuthService = {
  async login(email: string, password: string): Promise<User> {
    const response = await api.post('/auth/login', { email, password });
    return response.data as User;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/user');
    return response.data as User;
  },
};
