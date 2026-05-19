import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);
      set({ user: response.data, token: response.data.token, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);
      set({ user: response.data, token: response.data.token, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
