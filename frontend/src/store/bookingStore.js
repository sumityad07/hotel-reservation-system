import { create } from 'zustand';
import axiosInstance from './axiosInstance'; // Your custom axios instance

const Api_url = '/booking'; // Will be combined with axiosInstance.baseURL

const useBookingStore = create((set, get) => ({
  // --- State for the Booking Form (Simplified) ---
  hotelId: null,
  roomTypeId: null,
  checkInDate: '',
  checkOutDate: '',
  numberOfGuests: 1,
  myBooking:[],

  // --- UI/Status State ---
  error: null,
  message: null,
  loading: false,
  // Removed: calculationLoading
  // Removed: roomTypeDetails
  // Removed: pricePerNight

  // --- Setters ---
  setHotelId: (id) => set({ hotelId: id }),
  setRoomTypeId: (id) => set({ roomTypeId: id }),
  setCheckInDate: (date) => set({ checkInDate: date }),
  setCheckOutDate: (date) => set({ checkOutDate: date }),
  setNumberOfGuests: (num) => set({ numberOfGuests: num }),
  setMyBooking: (booking) => set({ myBooking: booking }),
  setError: (err) => set({ error: err }),
  setMessage: (msg) => set({ message: msg }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  // Removed: setCalculationLoading


  // --- Async Action: Create Booking ---
  createBooking: async (navigate) => {
    // Get only fields that frontend needs to send to backend
    const { hotelId, roomTypeId, checkInDate, checkOutDate, numberOfGuests } = get(); // Removed totalPrice

    set({ message: null, error: null, loading: true });

    // Simplified validation: only check fields sent from frontend
    // totalPrice is now calculated solely on backend, so no need to validate <=0 here
    if (!hotelId || !roomTypeId || !checkInDate || !checkOutDate || numberOfGuests < 1) {
      set({ error: 'All required booking details (dates, guests) must be provided.', loading: false });
      return;
    }

    try {
      // Backend will calculate totalPrice and validate maxOccupancy
      const response = await axiosInstance.post(`${Api_url}/create`, {
        hotel: hotelId,
        roomTypeListing: roomTypeId,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        // Removed: totalPrice from payload as backend calculates it
      });

      console.log('Booking successful:', response.data);
      set({ message: response.data.message || 'Booking created successfully!', loading: false });
      

      if (navigate) {
        setTimeout(() => {
          navigate(`/my-bookings/${response.data.booking._id}`);
        }, 1500);
      }
      get().resetForm();

    } catch (err) {
      console.error("Booking creation error:", err.message);
      set({
        error: err.response?.data?.message || "Failed to create booking. Please check details and try again.",
        loading: false,
      });
    }
  },

  fetchMyBookings: async (userId) => {
   
    set({ message: null, error: null, loading: true, myBookings: [] }); // Re-initialize array at start of fetch

    try {
      const response = await axiosInstance.get(`${Api_url}/my-bookings`, {
        // You might need to add headers/withCredentials here if axiosInstance isn't global
        // headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        // withCredentials: true,
      });
      
    

      // Ensure response.data is an array or convert it
      const fetchedBookings = Array.isArray(response.data) ? response.data : [];
      if (response.data.bookings && Array.isArray(response.data.bookings)) { // If backend nests it in 'bookings' property
          fetchedBookings = response.data.bookings;
      }
      
      set({ myBookings: fetchedBookings, loading: false, error: null, message: 'Bookings loaded!' });
      console.log('  myBookings state after successful set:', get().myBookings);

    } catch (err) {
      console.error("--- FETCH ERROR IN STORE ---");
      console.error("  Error object:", err);
      console.error("  Error response data:", err.response?.data);
      let errorMessage = err.response?.data?.message || "Failed to load bookings. Please try again.";
      set({ error: errorMessage, loading: false, myBookings: [], message: null }); // Clear bookings on error
    } finally {
        console.log("--- FETCH MY BOOKINGS ACTION ENDED ---");
    }
  },
  
  resetForm: () => set({
    hotelId: null, roomTypeId: null, checkInDate: '', checkOutDate: '',
    numberOfGuests: 1,

    error: null, message: null, loading: false,
   myBooking:[],
  }),
}));

export default useBookingStore;