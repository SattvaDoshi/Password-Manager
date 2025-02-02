import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

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
      set({ 
        passwords: Array.isArray(response.data) ? response.data : [], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching passwords:', error);
      set({ 
        passwords: [],
        error: error.response?.data?.message || "Error fetching passwords", 
        isLoading: false 
      });
      toast.error("Failed to fetch passwords");
      throw error;
    }
  },

  addPassword: async (passwordData) => {
    set({ isLoading: true, error: null });
    const loadingToast = toast.loading("Adding password...");
    
    try {
      const response = await axios.post(`${API_URL}/passwords`, passwordData);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      set((state) => ({ 
        passwords: [...state.passwords, response.data],
        isLoading: false 
      }));

      toast.success("Password added successfully!", { id: loadingToast });
      return response.data;
    } catch (error) {
      console.error('Password creation error:', error);
      set({ 
        error: error.response?.data?.message || "Error adding password", 
        isLoading: false 
      });
      toast.error("Failed to add password", { id: loadingToast });
      throw error;
    }
  },

  updatePassword: async (id, passwordData) => {
    set({ isLoading: true, error: null });
    const loadingToast = toast.loading("Updating password...");
    
    try {
      const response = await axios.put(`${API_URL}/passwords/${id}`, passwordData);
      set((state) => ({
        passwords: state.passwords.map(pwd => 
          pwd.id === id ? { ...pwd, ...response.data } : pwd
        ),
        message: "Password updated successfully",
        isLoading: false
      }));

      toast.success("Password updated successfully!", { id: loadingToast });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error updating password", 
        isLoading: false 
      });
      toast.error("Failed to update password", { id: loadingToast });
      throw error;
    }
  },

  deletePassword: async (id) => {
    set({ isLoading: true, error: null });
    const loadingToast = toast.loading("Deleting password...");
    
    try {
      await axios.delete(`${API_URL}/passwords/${id}`);
      set((state) => ({
        passwords: state.passwords.filter(pwd => pwd.id !== id),
        message: "Password deleted successfully",
        isLoading: false
      }));

      toast.success("Password deleted successfully!", { id: loadingToast });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error deleting password", 
        isLoading: false 
      });
      toast.error("Failed to delete password", { id: loadingToast });
      throw error;
    }
  },

  setSearchTerm: (term) => set({ searchTerm: term }),
  clearError: () => set({ error: null }),
  clearMessage: () => set({ message: null }),
  reset: () => set(initialState)
}));
