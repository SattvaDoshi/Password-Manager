import { create } from "zustand";
import axios from "axios";

export const API_URL = "http://localhost:5000/api";

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const initialState = {
  passwords: [],
  isLoading: false,
  error: null,
  message: null,
  searchTerm: '',
};

export const usePasswordStore = create((set) => ({
  ...initialState,

  fetchPasswords: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/passwords`);
      // Ensure passwords array is never undefined
      set({ 
        passwords: Array.isArray(response.data) ? response.data : [], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching passwords:', error);
      set({ 
        passwords: [], // Ensure passwords is always an array
        error: error.response?.data?.message || "Error fetching passwords", 
        isLoading: false 
      });
      throw error;
    }
  },

  addPassword: async (passwordData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/passwords`, passwordData);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      set((state) => ({ 
        passwords: [...state.passwords, response.data],
        message: "Password added successfully",
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      console.error('Password creation error:', error);
      set({ 
        error: error.response?.data?.message || "Error adding password", 
        isLoading: false 
      });
      throw error;
    }
  },

  updatePassword: async (id, passwordData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/passwords/${id}`, passwordData);
      set((state) => ({
        passwords: state.passwords.map(pwd => 
          pwd.id === id ? { ...pwd, ...response.data } : pwd
        ),
        message: "Password updated successfully",
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error updating password", 
        isLoading: false 
      });
      throw error;
    }
  },

  deletePassword: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/passwords/${id}`);
      set((state) => ({
        passwords: state.passwords.filter(pwd => pwd.id !== id),
        message: "Password deleted successfully",
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error deleting password", 
        isLoading: false 
      });
      throw error;
    }
  },

  setSearchTerm: (term) => set({ searchTerm: term }),
  clearError: () => set({ error: null }),
  clearMessage: () => set({ message: null }),
  reset: () => set(initialState)
}));