import React from 'react'
import Hotel_input_Field from '../components/HotelInputField/Hotel_input_Field'
import Input_Btn from '../components/Login _button/Input_Btn'
import sm_Published from '../assets/sm_Publish.png'
import usehotelStore from '../store/hotelStore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';



const PublishedHotel = () => {

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; // <--- Corrected
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const navigate = useNavigate();

  const {
    name, setName, price, setPrice, location, setLocation, description, setDescription,
    image, setImage,
    error, message, loading, hotelRegister, setError, setMessage, setLoading, resetForm
  } = usehotelStore();

  

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    return () => { resetForm(); };
  }, [resetForm]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !description || !location || !selectedFile) {
      setError("All fields are required, including the image.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    let uploadedImageUrl = '';

    try {
      // --- Step 1: Upload Image DIRECTLY to Cloudinary ---
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); // Your unsigned upload preset

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      uploadedImageUrl = cloudinaryResponse.data.secure_url;
      setImage(uploadedImageUrl);

      // --- Step 2: Register the Hotel with the Cloudinary Image URL ---
      await hotelRegister(navigate);

    } catch (err) {
      let errMsg = "An error occurred during hotel registration. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        errMsg = err.response.data.message;
      } else if (err.request) {
        errMsg = "Network error. Check connection or backend server.";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/*mobile view */}
      <form onSubmit={handleSubmit} className=" block md:hidden relative  main_div flex flex-col justify-center align-middle items-center gap-3 overflow-hidden h-full pb-20 ">
        <h1 className='text-2xl font-semibold text-center'>From Lisiting TO Booked-- Manage it All Here</h1>
        <Hotel_input_Field value ={name} onChange={(e) => setName(e.target.value)}   name="Hotel Name" />
        <Hotel_input_Field value ={price} onChange={(e) => setPrice(e.target.value)} name="Starting Price" />
        <div className='flex flex-col items-center  '>
          <h2 className='text-xl font-bold text-[#3f49a5]'>Hotel image</h2>
          <Hotel_input_Field 
            onChange={handleFileChange} // <--- ADD THIS CRUCIAL HANDLER
             accept="image/*" // <--- ADD THIS
           required // 
          
          field="file" name="upload image" className="w-[55%]  items-center text-center p-2 " />
        </div>

        <Hotel_input_Field value={location} onChange={(e) => setLocation(e.target.value)} name="Location" />
        <Hotel_input_Field value={description} onChange={(e) => setDescription(e.target.value)} field="textarea" className=" rounder-lg  h-24 w-[75%]" name="Short  Description" />
        <Input_Btn type="submit" disabled={loading} text={loading ? "submiting in..." : "submit"}  name="Submit" />
        <img src={sm_Published} alt="sm_Published" className='w-[100%] h-[100%]   object-cover pointer-events-none ' />
      </form>

      {/*desktop view */}

      <div className="hidden md:block main_div md:flex justify-center items-center h-screen  border-2 gap-[10%] ">
        <div className="left_side">
          <h1 className='text-3xl font-bold'>From Listing to Booked — Manage It All Here</h1>
          <img className='w-[90%] h-[90%] object-cover' src={sm_Published} alt="" />
        </div>
      
          <form onSubmit={handleSubmit} className='right_side flex flex-col gap-2 justify-center items-center'  action="">
           <Hotel_input_Field value={name} onChange={(e) => setName(e.target.value)} name="Hotel Name" />
          <Hotel_input_Field value={price} onChange={(e) => setPrice(e.target.value)} name="Starting Price" />
          <div className='flex flex-col items-center  '>
            <h2 className='text-xl font-bold text-[#3f49a5]'>Hotel image</h2>
            {/* <--- ADD THIS CRUCIAL HANDLER */}
            <Hotel_input_Field onChange={handleFileChange} accept="image/*" required field="file" name="upload image" className="w-[55%]  items-center text-center p-2 " />
          </div>

          <Hotel_input_Field value={location} onChange={(e) => setLocation(e.target.value)} name="Location" />
          <Hotel_input_Field value={description} onChange={(e) => setDescription(e.target.value)} field="textarea" className=" rounded-lg  h-24 w-[75%]" name="Short  Description" />
          <Input_Btn type="submit" disabled={loading} text={loading ? "submiting in..." : "submit"} name="Submit" />
          </form>
         
        
      </div>
    </>

  )
}

export default PublishedHotel