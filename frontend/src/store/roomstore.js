//make room store 
import { create } from "zustand";
import axiosInstance from "./axiosInstance"; // Assuming axiosInstance is in the same directory or adjust path

// IMPORTANT: Ensure this matches your backend's API path for room type listings
const Api_url = '/room'; // Will be combined with axiosInstance.baseURL: http://192.168.29.113:3000/api/roomType


const useRoomStore = create((set, get) => ({
    // --- State ---
    hotelId: "",         // ID of the hotel this room type belongs to (will be provided by component)
    categoryName: "",    // e.g., "Deluxe Room", "Suite"
    price: "",
    description: "",
    image: "",           // URL of the room type image (uploaded separately to Cloudinary)
    maximumOccupancy: "",
    freeEntities: "",    // e.g., "Free Wi-Fi, Breakfast"
    category: "",  
    rooms:[],      // e.g., "Double", "Single", "Family"
    

    error: "",
    message: "",
    loading: false,

    // --- Actions (Setters) ---
    setHotelId: (id) => set({ hotelId: id }),
    setCategoryName: (name) => set({ categoryName: name }),
    setPrice: (price) => set({ price }),
    setDescription: (desc) => set({ description: desc }),
    setImage: (img) => set({ image: img }),
    setMaximumOccupancy: (occupancy) => set({ maximumOccupancy: occupancy }),
    setFreeEntities: (entities) => set({ freeEntities: entities }),
    setCategory: (cat) => set({ category: cat }),
    setRooms : (rooms) => set({rooms:rooms}),
   

    setError: (error) => set({ error }),
    setMessage: (msg) => set({ message: msg }),
    setLoading: (isLoading) => set({ loading: isLoading }),

    // --- Async API Action: Create Room Type Listing ---
    createRoomTypeListing: async (navigate) => { // Accepts navigate for redirection
        const {
            hotelId, categoryName, price, description, image,
            maximumOccupancy, freeEntities, category
        } = get(); // Get current state values

        set({ message: "", error: "", loading: true }); // Clear messages, set loading

        // Basic client-side validation (optional, but good practice)
        if (!hotelId || !categoryName || !price || !description || !image || !maximumOccupancy || !freeEntities || !category) {
            set({ error: "All room type fields are required.", loading: false });
            return;
        }
        // You might add type checks (e.g., price is number, maxOccupancy is number)

        try {
            const response = await axiosInstance.post(
                `${Api_url}/roomlisting`, // Assuming your backend route is POST /api/roomType/register
                {
                    hotel: hotelId, // Make sure this matches your backend's expected field name 'hotel'
                    categoryName,
                    price,
                    description,
                    image, // This should be the Cloudinary URL from frontend upload
                    maximumOccupancy,
                    freeEntities,
                    category
                },
                {
                    headers: { 'Content-Type': 'application/json' }, // Handled by axiosInstance, but ensures JSON payload
                    withCredentials: true,
                }
            );

           
            set({ message: response.data.message, error: "", loading: false });
            get().resetForm(); // Clear the form after successful submission

            if (navigate) {
                setTimeout(() => {
                   
                    navigate(`/roomListing/${hotelId}`); 
                }, 1000);
            }

        } catch (error) {
            console.error("Error creating room type listing:", error);
            let errorMessage = "Failed to create room type. Please try again.";

            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message; // Use backend's specific message
            } else if (error.request) {
                errorMessage = "Network error. Could not connect to backend.";
            }
            set({ error: errorMessage, message: "", loading: false });
        }
    },

    //all rooms for particular hotel
    getRooms: async (hotelId) => {
        set({ loading: true, error: "", rooms: [] }); // Clear previous data/errors
        try {
            const response = await axiosInstance.get(`${Api_url}/byHotel/${hotelId}`);
            
            set({ rooms: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching rooms:", error);
            set({ error: "Failed to fetch rooms. Please try again.", loading: false });
        }
    },

    // --- Reset Form Action ---
    resetForm: () => set({
        hotelId: "",
        categoryName: "",
        price: "",
        description: "",
        image: "",
        maximumOccupancy: "",
        freeEntities: "",
        category: "",
        error: "",
        message: "",
        loading: false,
        rooms:[]
    }),
}));

export default useRoomStore;