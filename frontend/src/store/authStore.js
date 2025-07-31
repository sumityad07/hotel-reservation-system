
import { decodeJwt } from 'jose';// You'll need to install this library

import {create} from 'zustand';
import axios from 'axios';
 // Ensure correct path for your setup
import axiosInstance from './axiosInstance';

// Helper function to decode token (this helper function itself is fine)
const getDecodedTokenDetails = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = decodeJwt(token);
      return {
        role: decoded.role || null,
        id: decoded.id || decoded._id || null
      };
    } catch (error) {
      console.error("Failed to decode token from localStorage:", error);
      localStorage.removeItem('token'); // Remove invalid token
      return { role: null, id: null };
    }
  }
  return { role: null, id: null };
};

// --- CRITICAL FIX: REMOVE THESE TOP-LEVEL INITIALIZATIONS ---
// const { role: initialUserRole, id: initialUserId } = getDecodedTokenDetails(); // REMOVE THIS LINE


const useAuthStore = create((set,get) => ({
  // --- State ---
  email: '',
  password: '',
  error: '',
  successMessage: '',
  loading: false,
  // --- CRITICAL FIX: Initialize these to null/false directly ---
  userRole: null, // <--- Initialize to null
  userId: null,   // <--- Initialize to null
  isLoggedIn: false, // <--- Initialize to false (will be set by initializeAuth or login/signup)

  // --- Actions ---
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),
  setSuccessMessage: (msg) => set({ successMessage: msg }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
  setUserRole: (role) => set({ userRole: role }),
  setUserId: (id) => set({ userId: id }),

  // --- Action to explicitly initialize auth state from localStorage (called by App.jsx) ---
  initializeAuth: () => {
    const { role, id } = getDecodedTokenDetails(); // This is where decoding happens
    console.log("Auth Store: Initializing auth state from token. Role:", role, "ID:", id); // Debugging
    if (role && id) {
      set({ isLoggedIn: true, userRole: role, userId: id });
    } else {
      set({ isLoggedIn: false, userRole: null, userId: null }); // Ensure cleared if no valid token
    }
  },

  signup: async (navigate) => {
    const { email, password } = get();
    set({ loading: true, error: '', successMessage: '' });
    try{
      const response = await axiosInstance.post(`${Api_url}/signup`, { email, password }, {
        headers: { 'Content-Type': 'application/json' }, withCredentials: true,
      });

      if(response?.data?.token){
        localStorage.setItem("token", response.data.token);
        // This small delay can help localStorage persist before rapid navigation
        await new Promise(resolve => setTimeout(resolve, 200)); // Keep this delay
      }
      // Update state after successful API call and localStorage set
      set({ successMessage: response.data.message, loading: false, isLoggedIn: true,
            userRole: response.data.role, userId: response.data.id || response.data.user_id
      });

      // No need for a long timeout here, initializeAuth on next page load will handle it
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      set({ error: error.response?.data?.message || 'Signup failed', loading: false, isLoggedIn: false, userRole: null, userId: null });
    }
  },

  login: async (navigate)=>{
    const {email,password}= get()
    set({loading:true, error:'',successMessage:''})
    try {
      const response = await axiosInstance.post(`${Api_url}/login`, { email, password }, {
        headers: { 'Content-Type': 'application/json', }, withCredentials: true,
      });

      if(response?.data?.token){
        localStorage.setItem("token", response.data.token);
        // Keep this small delay
        await new Promise(resolve => setTimeout(resolve, 200)); // Keep this delay
      }
      // Update state after successful API call and localStorage set
      set({ successMessage: response.data.message, loading: false, isLoggedIn: true,
            userRole: response.data.role, userId: response.data.id || response.data.user_id
      });

      // No need for a long timeout here, initializeAuth on next page load will handle it
      navigate("/");
    } catch (error) {
      console.error("login error:", error);
      set({ error: error.response?.data?.message || 'Login failed', loading: false, isLoggedIn: false, userRole: null, userId: null });
    }
  },

  logout: async (navigate) => {
    set({ loading: true, error: '', successMessage: '' });
    try {
      const response = await axios.delete(`${Api_url}/logout`, { withCredentials: true, });
      localStorage.removeItem('token');
      set({ isLoggedIn: false, successMessage: response.data.message || "Logged out successfully!",
            loading: false, userRole: null, userId: null });
      get().resetForm(); // Clears form also
      if (navigate) { navigate("/login"); }
    } catch (error) {
      console.error("Logout failed error:", error);
      localStorage.removeItem('token');
      set({ isLoggedIn: false, error: error.response?.data?.message || "Logout failed. Please try again.", loading: false, userRole: null, userId: null });
      get().resetForm();
      if (navigate) { navigate("/login"); }
    }
  },

  resetForm: () => set({
    email: '', password: '', error: '', successMessage: '', loading: false,
    userRole: null, userId: null, isLoggedIn: false
  }),

}));

export default useAuthStore;