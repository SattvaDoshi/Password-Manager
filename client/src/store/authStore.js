import { create } from "zustand";
import axios from "axios";

export const API_URL = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true;

const authAxios = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
	  'Accept': 'application/json',
	  'Content-Type': 'application/json'
	}
  });

  authAxios.interceptors.request.use((config) => {
	const token = localStorage.getItem('token'); // or wherever you store your token
	if (token) {
	  config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
  });

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
		  const response = await authAxios.post('/login', { email, password });
		  const { token, user } = response.data;
		  
		  localStorage.setItem('userId', user._id);
		  if (token) {
			localStorage.setItem('token', token);
		  }
		  
		  set({
			isAuthenticated: true,
			user,
			error: null,
			isLoading: false,
		  });
		} catch (error) {
		  set({ 
			error: error.response?.data?.message || "Error logging in", 
			isLoading: false 
		  });
		  throw error;
		}
	  },

	  logout: async () => {
		set({ isLoading: true, error: null });
		try {
		  await authAxios.post('/logout');
		  localStorage.clear();
		  set({ 
			user: null, 
			isAuthenticated: false, 
			error: null, 
			isLoading: false 
		  });
		} catch (error) {
		  set({ error: "Error logging out", isLoading: false });
		  throw error;
		}
	  },
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
		  const token = localStorage.getItem('token');
		  
		  if (!token) {
			set({ 
			  user: null, 
			  isAuthenticated: false, 
			  isCheckingAuth: false 
			});
			return;
		  }
	
		  const response = await authAxios.get('/check-auth/'+localStorage.getItem('userId'));
		  
		  if (response.data?.user) {
			set({ 
			  user: response.data.user, 
			  isAuthenticated: true, 
			  isCheckingAuth: false 
			});
		  } else {
			// Clear invalid token
			localStorage.removeItem('token');
			set({ 
			  user: null, 
			  isAuthenticated: false, 
			  isCheckingAuth: false 
			});
		  }
		} catch (error) {
		  console.error('Auth check failed:', error);
		  // Clear invalid token
		  localStorage.removeItem('token');
		  set({ 
			user: null,
			isAuthenticated: false,
			isCheckingAuth: false,
			error: error.response?.data?.message || "Authentication check failed"
		  });
		}
	  },
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));
