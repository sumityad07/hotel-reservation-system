
import {create} from "zustand"
import axios from "axios";

import axiosInstance from "./axiosInstance";


const Api_url = '/hotel';




const usehotelStore = create((set,get) => ({
    name:"",
    price:"",
    description:"",
    image:"",
    location:"",
    error:"",
    message:"",
    loading:false,
    currentHotel: null,
    currentHotelError: null,
    ownedHotels:[],
    hotels:[],

    //action
    setName:(name) => set({ name }),
    setPrice: (price) => set({ price }),
    setDescription: (description) => set({ description }),
    setLocation:(location)=>set({ location }),
    setImage:(image) => set({ image }),
    setError:(error) => set({ error }),
    setMessage:(message)=>set({message}),
    setLoading:(loading)=>set({loading}),
    setOwner:(ownedHotels)=>set({ownedHotels:ownedHotels}),
    setHotels:(hotels)=>set({hotels:hotels}),

    setCurrentHotel: (hotel) => set({ currentHotel: hotel }),
    setCurrentHotelError: (error) => set({ currentHotelError: error }),

    //fetching api

    hotelRegister:async (navigate) => {
        const {name,price,description,location,image}=get()
        set({message:"",error:"",loading:true})
        try {
            
        const response = await axiosInstance.post(
            `${Api_url}/register`,
            { name, price, description, location, image },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials:true,
            }   
        );
      
            set({message:response.data.message, error:"", loading:false})
           
             setTimeout(()=>{
                navigate(`/roomListing/${response.data.hotel._id}`)
             },1000)
             
               
        
        } catch (error) {
             console.error("Hotel Registration Error:", error); // Log the full error object
            let errorMessage = "An unexpected error occurred.";
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = "No response from server. Check network/backend status.";
            }
            set({error: errorMessage, message: "", loading: false});
        }
    },

     hotelDetails: async (id) => { // Corrected typo from 'hotaldetails'
        set({loading: true, currentHotel: null, currentHotelError: null}); // Clear previous data/errors
        try {
            // Adjust this endpoint if your backend uses a different path for hotel details by ID
            const response = await axiosInstance.get(`${Api_url}/details/${id}`); // Assuming route like /api/hotel/details/:id
   
            set({loading: false, currentHotel: response.data, currentHotelError: null}); // Store fetched hotel
            return response.data; // Return data for component to use if needed
        } catch (error) {
            console.error("Hotel Details Fetch Error:", error);
            let errorMessage = "Failed to load hotel details.";
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = "Network error. Could not connect to backend.";
            }
            set({loading: false, currentHotel: null, currentHotelError: errorMessage});
           // Re-throw error so component can catch it for local handling if desired
        }
    },
 
    ownerHotel:async()=>{
        set({loading:true, loading:true,error:""})
        try{
            const response =  await axiosInstance.get(`${Api_url}/hotel/byOwner`)
         
            set({loading:false, error:"",ownedHotels:response.data})
        }
        catch(err){
            let errMsg = "An unexpected error occurred.";
            if (err.response && err.response.data && err.response.data.message) {
                errMsg = err.response.data.message;
            } else if (err.request) {
                errMsg = "No response from server. Check network/backend status.";
            }
            set({error: errMsg, loading: false});
        }


    },
    //get all hotels
    getAllHotels : async()=>{
        set({loading:true, error:"",hotel:[]})
        try {
            const response = await axiosInstance.get(`${Api_url}/allHotels`)
    
            set({loading:false, error:"", hotels:response.data})
            
            
        } catch (error) {
            let errMsg = "An unexpected error occurred.";
            if (error.response && error.response.data && error.response.data.message) {
                errMsg = error.response.data.message;
            } else if (error.request) {
                errMsg = "No response from server. Check network/backend status.";
            }
            set({error: errMsg, loading: false});
            
        }
    },


        
 resetForm: () => set({
        name: "",
        price: "",
        description: "",
        image: "",
        location: "",
        error: "",
        message: "",
        loading: false,
        ownedHotels:[],
        hotels:[],
    }),



}));
export default usehotelStore;

   

