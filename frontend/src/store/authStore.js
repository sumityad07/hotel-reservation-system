import {create} from 'zustand';
import axios from 'axios';
import jwt_decode from 'jwt-decode/build/jwt-decode.js'; // Ensure this path is correct
import axiosInstance from './axiosInstance';

// Helper function to decode token and get user details (this function itself is fine)
const getDecodedTokenDetails = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwt_decode(token);
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

const useAuthStore = create((set,get) => ({
  // --- State ---
  email: '',
  password: '',
  error: '',
  successMessage: '',
  loading: false,
  // --- CRITICAL FIX: Initialize these to null/false ---
  userRole: null,
  userId: null,
  isLoggedIn: false, // Will be set to true by initializeAuth or login/signup actions

  // --- Actions ---
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),
  setSuccessMessage: (msg) => set({ successMessage: msg }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
  setUserRole: (role) => set({ userRole: role }),
  setUserId: (id) => set({ userId: id }),

  // --- NEW: Action to explicitly initialize auth state from localStorage ---
  initializeAuth: () => {
    const { role, id } = getDecodedTokenDetails(); // Decode token from localStorage
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
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if(response?.data?.token){
        localStorage.setItem("token", response.data.token);
        // Added delay (keep if it helps)
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      // Update state after successful API call and localStorage set
      set({
        successMessage: response.data.message,
        loading: false,
        isLoggedIn: true,
        userRole: response.data.role,
        userId: response.data.id || response.data.user_id
      });

      setTimeout(()=>{
        navigate("/")
      },2000)
    } catch (error) {
      console.error("Signup error:", error);
      set({
        error: error.response?.data?.message || 'Signup failed',
        loading: false, isLoggedIn: false, userRole: null, userId: null
      });
    }
  },

  login: async (navigate)=>{
    const {email,password}= get()
    set({loading:true, error:'',successMessage:''})
    try {
      const response = await axiosInstance.post(`${Api_url}/login`, { email, password }, {
        headers: { 'Content-Type': 'application/json', },
        withCredentials: true,
      });

      if(response?.data?.token){
        localStorage.setItem("token", response.data.token);
        // Added delay (keep if it helps)
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      // Update state after successful API call and localStorage set
      set({
        successMessage: response.data.message,
        loading: false,
        isLoggedIn: true,
        userRole: response.data.role,
        userId: response.data.id || response.data.user_id
      });

      setTimeout(()=>{
        navigate("/")
      },1000)

    } catch (error) {
      console.error("login error:", error);
      set({
        error: error.response?.data?.message || 'Login failed',
        loading: false, isLoggedIn: false, userRole: null, userId: null
      });
    }
  },

  logout: async (navigate) => {
    set({ loading: true, error: '', successMessage: '' });
    try {
      const response = await axios.delete(`${Api_url}/logout`, { withCredentials: true, });
      console.log('Logout successful (backend response):', response.data);
      localStorage.removeItem('token');
      set({
        isLoggedIn: false, successMessage: response.data.message || "Logged out successfully!",
        loading: false, userRole: null, userId: null
      });
      get().resetForm(); // Reset form also clears userRole/userId
      if (navigate) { setTimeout(() => { navigate("/login"); }, 200); }
    } catch (error) {
      console.error("Logout failed error:", error);
      localStorage.removeItem('token');
      set({
        isLoggedIn: false, error: error.response?.data?.message || "Logout failed. Please try again.",
        loading: false, userRole: null, userId: null
      });
      get().resetForm();
      if (navigate) { setTimeout(() => { navigate("/login"); }, 500); }
    }
  },

  resetForm: () => set({
    email: '', password: '', error: '', successMessage: '', loading: false,
    userRole: null, userId: null, isLoggedIn: false // Ensure isLoggedIn is false on reset
  }),

}));

export default useAuthStore;