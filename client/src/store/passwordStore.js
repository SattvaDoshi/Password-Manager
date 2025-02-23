import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

export const API_URL = "https://password-manager-bhuw.onrender.com/api";

// Create axios instance with default config
const passwordAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
passwordAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for error handling
passwordAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      // Optional: Trigger logout or redirect to login
    }
    return Promise.reject(error);
  }
);

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
      const response = await passwordAxios.get('/passwords');
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
      const response = await passwordAxios.post('/passwords', passwordData);
      
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
      const response = await passwordAxios.put(`/passwords/${id}`, passwordData);
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
      await passwordAxios.delete(`/passwords/${id}`);
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

export default usePasswordStore;