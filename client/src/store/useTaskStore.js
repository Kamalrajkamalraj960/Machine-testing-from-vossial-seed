import { create } from 'zustand';
import api from '../api/axios';

const useTaskStore = create((set, get) => ({
  tasks: [],
  analytics: {
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
  },
  isLoading: false,
  error: null,

  fetchTasks: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await api.get(`/tasks?${params.toString()}`);
      set({
        tasks: response.data.tasks,
        analytics: response.data.analytics,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch tasks',
        isLoading: false,
      });
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/tasks', taskData);
      // Re-fetch tasks to update the list and analytics
      await get().fetchTasks();
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create task',
        isLoading: false,
      });
      return false;
    }
  },

  updateTask: async (id, taskData) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/tasks/${id}`, taskData);
      await get().fetchTasks();
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update task',
        isLoading: false,
      });
      return false;
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/tasks/${id}`);
      await get().fetchTasks();
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete task',
        isLoading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useTaskStore;
