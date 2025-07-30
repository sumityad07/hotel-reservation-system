import React, { useEffect, useState } from 'react';
import { useNavigate, useParams,Link } from 'react-router-dom';
// IMPORTANT: Use axiosInstance for authenticated calls
import axiosInstance from '../store/axiosInstance'; // <--- Correct import (adjust path if needed)

import Loader from '../components/Loader/Loader';
import moment from 'moment';
import Input_Btn from '../components/Login _button/Input_Btn';



const BookingDetailsPage = () => {
  const { id: bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError("Booking ID not provided in the URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // --- CRITICAL FIX: Use axiosInstance.get here ---
        const response = await axiosInstance.get(`booking/${bookingId}`); // <--- Use axiosInstance.get and base path relative to it
        setBooking(response.data);
      } catch (err) {
        console.error("Failed to fetch booking details:", err);
        setError(err.response?.data?.message || "Could not load booking details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center text-lg mt-10">{error}</p>;
  if (!booking) return <p className="text-gray-600 text-center text-lg mt-10">Booking not found or no data available.</p>;

  const {
    user, hotel, roomTypeListing,
    checkInDate, checkOutDate, numberOfGuests,
    totalPrice, status, createdAt
  } = booking;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl">
        {/* ... rest of your JSX ... */}
        <div className="bg-[#3f49a5] p-6 text-white text-center">
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="text-lg mt-1">Your reservation for {hotel?.name} is all set.</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-800">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-semibold mb-3 text-[#FF7A30]">Hotel Details</h2>
            <div className="flex items-center space-x-4 mb-4">
              {hotel?.image && <img src={hotel.image} alt={hotel.name} className="w-24 h-24 object-cover rounded-lg shadow" />}
              <div>
                <p className="text-xl font-bold">{hotel?.name}</p>
                <p className="text-gray-600">{hotel?.location}</p>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-semibold mb-3 text-[#FF7A30]">Room Type Details</h2>
            <div className="flex items-center space-x-4 mb-4">
              {roomTypeListing?.image && <img src={roomTypeListing.image} alt={roomTypeListing.categoryName} className="w-24 h-24 object-cover rounded-lg shadow" />}
              <div>
                <p className="text-xl font-bold">{roomTypeListing?.categoryName}</p>
                <p className="text-gray-600">{roomTypeListing?.description}</p>
                <p className="text-gray-600">Max Guests: {roomTypeListing?.maximumOccupancy}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-semibold">Check-in Date:</p>
            <p>{moment(checkInDate).format('MMMM Do, YYYY')}</p>
          </div>
          <div>
            <p className="font-semibold">Check-out Date:</p>
            <p>{moment(checkOutDate).format('MMMM Do, YYYY')}</p>
          </div>
          <div>
            <p className="font-semibold">Number of Guests:</p>
            <p>{numberOfGuests}</p>
          </div>

          <div>
            <p className="font-semibold">Booked By:</p>
            <p>{user?.email || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-gray-100 p-6 flex justify-between items-center text-lg font-bold">
          <div>
            <p>Booking ID:</p>
            <p className="text-sm text-gray-600">{booking._id}</p>
          </div>
          <div className="text-right">
            <p>Total Price:</p>
            <p className="text-green-600 text-3xl">${totalPrice.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-gray-100 px-6 py-3 text-center text-sm">
          <p>Status: <span className={`font-semibold ${status === 'confirmed' ? 'text-green-500' : status === 'pending' ? 'text-orange-500' : 'text-red-500'}`}>{status.toUpperCase()}</span></p>
          <p className="text-xs text-gray-500">Booked on: {moment(createdAt).format('MMMM Do, YYYY [at] h:mm A')}</p>
        </div>

        <Link to ="/" className="p-6 text-center">
           <Input_Btn name="back to home" />
        </Link>
      </div>
    </div>
  );
};

export default BookingDetailsPage;