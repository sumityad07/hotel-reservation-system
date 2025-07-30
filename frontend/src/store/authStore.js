import {create} from 'zustand';
import axios from 'axios';
import jwt_decode from 'jwt-decode'; // You'll need to install this library
import axiosInstance from './axiosInstance';

// Install jwt-decode:
// npm install jwt-decode
// or
// yarn add jwt-decode

const Api_url = "/user"

// Helper function to decode token and get user details
const getDecodedTokenDetails = () => {
  const token = localStorage.getItem('token');
  console.log("PRODUCTION DEBUG - getDecodedTokenDetails: Token from localStorage (at init):", token); // <-- Add this
  if (token) {
    try {
      const decoded = jwt_decode(token);
      console.log("PRODUCTION DEBUG - getDecodedTokenDetails: Decoded payload:", decoded); // <-- Add this
      return {
        role: decoded.role || null,
        id: decoded.id || decoded._id || null
      };
    } catch (error) {
      console.error("PRODUCTION DEBUG - getDecodedTokenDetails: jwt-decode FAILED:", error); // <-- Add this
      localStorage.removeItem('token'); // Remove invalid token
      return { role: null, id: null };
    }
  }
  console.log("PRODUCTION DEBUG - getDecodedTokenDetails: No token in localStorage."); // <-- Add this
  return { role: null, id: null };
};

const { role: initialUserRole, id: initialUserId } = getDecodedTokenDetails();


const useAuthStore = create((set,get) => ({
  // --- State ---
  email: '',
  password: '',
  error: '',
  successMessage: '',
  loading: false,
  userRole: initialUserRole, // <--- Initialize from decoded token
  userId: initialUserId,     // <--- Initialize from decoded token

  isLoggedIn: !!localStorage.getItem('token'), // Still check for token existence

  // --- Actions ---
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),
  setSuccessMessage: (msg) => set({ successMessage: msg }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
  setUserRole: (role) => set({ userRole: role }),
  setUserId: (id) => set({ userId: id }),

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
      }

      // --- CRITICAL FIX: Ensure userRole and userId are set from response ---
      set({
        successMessage: response.data.message,
        loading: false,
        isLoggedIn: true,
        userRole: response.data.role, // Direct assignment from response
        userId: response.data.id || response.data.user_id // Direct assignment from response
      });

      setTimeout(()=>{
        navigate("/")
      },2000)
    } catch (error) {
      console.error("Signup error:", error);
      set({
        error: error.response?.data?.message || 'Signup failed',
        loading: false,
        isLoggedIn: false,
        userRole: null,
        userId: null
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

    console.log('PRODUCTION DEBUG - Login Response Data:', response.data); // <-- Add this
    console.log('PRODUCTION DEBUG - Token in Response:', response.data.token); // <-- Add this

    
      if(response?.data?.token){
        localStorage.setItem("token", response.data.token);
      }


      set({
        successMessage: response.data.message,
        loading: false,
        isLoggedIn: true,
        userRole: response.data.role, // Direct assignment from response
        userId: response.data.id || response.data.user_id // Direct assignment from response
      });

  

      setTimeout(()=>{
        navigate("/")
      },1000)

    } catch (error) {
      console.error("login error:", error);
      set({
        error: error.response?.data?.message || 'Login failed',
        loading: false,
        isLoggedIn: false,
        userRole: null,
        userId: null
      });
    }
  },

  logout: async (navigate) => {
    set({ loading: true, error: '', successMessage: '' });

    try {
      const response = await axios.delete(`${Api_url}/logout`, {
        withCredentials: true,
      });



      localStorage.removeItem('token');
      set({
        isLoggedIn: false,
        successMessage: response.data.message || "Logged out successfully!",
        loading: false,
        userRole: null, // Clear on logout
        userId: null
      });
      get().resetForm();

      if (navigate) {
        setTimeout(() => {
          navigate("/login");
        }, 200);
      }

    } catch (error) {
      console.error("Logout failed error:", error);
      let errorMessage = error.response?.data?.message || "Logout failed. Please try again.";

      localStorage.removeItem('token');
      set({
        isLoggedIn: false,
        error: errorMessage,
        loading: false,
        userRole: null,
        userId: null
      });
      get().resetForm();

      if (navigate) {
        setTimeout(() => {
          navigate("/login");
        }, 500);
      }
    }
  },

  resetForm: () => set({
    email: '',
    password: '',
    error: '',
    successMessage: '',
    loading: false,
    userRole: null,
    userId: null
  }),

}));

export default useAuthStore;