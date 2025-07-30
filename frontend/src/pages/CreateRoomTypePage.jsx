import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // <--- Import useParams
import axios from 'axios';

// Import your custom input fields and buttons
import Hotel_input_Field from '../components/HotelInputField/Hotel_input_Field';
import Input_Btn from '../components/Login _button/Input_Btn';
import Loader from '../components/Loader/Loader';

// Import your new roomStore
import useRoomStore from '../store/roomstore'; // Adjust path if needed

// Cloudinary credentials
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; // <--- Corrected
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// REMOVED hotelId from props: Get it from useParams() instead
const CreateRoomTypePage = () => { // <--- REMOVED { hotelId } from here
  const navigate = useNavigate();
  const { hotelId } = useParams(); // <--- GET hotelId FROM URL PARAMETERS

  // Destructure state and actions from your roomStore
  const {
    categoryName, setCategoryName,
    price, setPrice,
    description, setDescription,
    image, setImage,
    maximumOccupancy, setMaximumOccupancy,
    freeEntities, setFreeEntities,
    category, setCategory,
    setHotelId: setStoreHotelId, // Rename to avoid conflict with local useParams variable

    error, message, loading,
    createRoomTypeListing,
    setError, setMessage, setLoading,
    resetForm
  } = useRoomStore();

  const [selectedFile, setSelectedFile] = useState(null);

  // Set the hotelId in the store when the component mounts or URL param changes
  useEffect(() => {
    if (hotelId) {
      setStoreHotelId(hotelId); // Set the hotelId in the Zustand store
    }
    return () => {
      resetForm(); // Clear form fields when component unmounts
    };
  }, [hotelId, setStoreHotelId, resetForm]);


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation: hotelId is now from useParams
    if (!hotelId || !categoryName || !price || !description || !selectedFile || !maximumOccupancy || !freeEntities || !category) {
      setError("All fields are required for the room type listing.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    let uploadedImageUrl = '';

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      uploadedImageUrl = cloudinaryResponse.data.secure_url;
      setImage(uploadedImageUrl);

      await createRoomTypeListing(navigate);

    } catch (err) {
      console.error("Room Type Creation Error:", err);
      let errMsg = "An error occurred during room type creation. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        errMsg = err.response.data.message;
      } else if (err.request) {
        errMsg = "Network error. Could not connect to backend.";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Render a message if hotelId is not provided (e.g., if user types a wrong URL without ID)
  if (!hotelId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">Error: Invalid URL. Hotel ID not provided.</p>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <Loader />
        </div>
      )}

      <div className={`flex justify-center items-center min-h-screen p-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center text-[#3f49a5] mb-4">Create New Room Type for Hotel ID: {hotelId}</h2>

          <Hotel_input_Field
            name="Category Name (e.g., Deluxe Double)"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
          <Hotel_input_Field
            name="Price Per Night"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Hotel_input_Field
            name="Maximum Occupancy"
            type="number"
            value={maximumOccupancy}
            onChange={(e) => setMaximumOccupancy(e.target.value)}
            required
          />
          <Hotel_input_Field
            name="Free Entities (e.g., Wi-Fi, Breakfast)"
            value={freeEntities}
            onChange={(e) => setFreeEntities(e.target.value)}
            required
          />
          <Hotel_input_Field
            name="Category (e.g., Double, Single, Family)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <Hotel_input_Field
            name="Description"
            field="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-24"
            required
          />

          <div className='flex flex-col items-center w-full'>
            <h2 className='text-xl font-bold text-[#3f49a5]'>Room Image</h2>
            <Hotel_input_Field
              field="file"
              name="upload image"
              className="w-full text-center p-2"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
            {selectedFile && (
              <p className="text-gray-600 text-xs mt-1">Selected: {selectedFile.name}</p>
            )}
            {image && (
              <img src={image} alt="Room Preview" className="mt-2 h-20 w-20 object-cover rounded" />
            )}
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-500 text-center">{message}</p>}

          <Input_Btn type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Room Type"}
          </Input_Btn>
        </form>
      </div>
    </>
  );
};

export default CreateRoomTypePage;