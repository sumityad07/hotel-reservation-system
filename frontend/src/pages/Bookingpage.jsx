import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import useAuthStore to get userId
import useAuthStore from '../store/authStore'; // <--- ADD THIS IMPORT
import useBookingStore from '../store/bookingStore';
import Hotel_input_Field from '../components/HotelInputField/Hotel_input_Field';
import Input_Btn from '../components/Login _button/Input_Btn';
import Loader from '../components/Loader/Loader'; // Assuming this import is correct

const BookingPage = () => {
  const { hotelId, roomTypeId } = useParams();
  
  const navigate = useNavigate();

  // Get userId and isLoggedIn from useAuthStore
  const { userId, isLoggedIn } = useAuthStore(); // <--- ADD THIS DESTRUCTURING

  const {
    checkInDate, setCheckInDate,
    checkOutDate, setCheckOutDate,
    numberOfGuests, setNumberOfGuests,
    error, message, loading,
    createBooking,
    resetForm,
    setHotelId: setStoreHotelId,
    setRoomTypeId: setStoreRoomTypeId,
    setError
  } = useBookingStore();

  useEffect(() => {
    // Only proceed if userId is available (user is logged in)
    if (hotelId && roomTypeId && userId) { // <--- ADD userId to the condition
      setStoreHotelId(hotelId);
      setStoreRoomTypeId(roomTypeId);
      // Removed: fetchRoomTypeDetails (as per your simplified version)
    } else if (!userId) { // Handle case where user is not logged in
      setError("Please log in to make a booking.");
      // Optional: Redirect to login page
      // navigate('/login');
    }
    return () => {
      resetForm();
    };
  }, [hotelId, roomTypeId, userId, resetForm, setStoreHotelId, setStoreRoomTypeId, setError, navigate]); // <--- Added userId, navigate to dependencies


  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBooking(navigate);
  };

  if (loading) return <Loader />; // Now Loader should be imported correctly

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-[#3f49a5] mb-4">Book Your Room</h2>

        <p className="text-sm text-gray-600 text-center mb-4">
            Booking for Hotel ID: {hotelId || 'N/A'}, Room Type ID: {roomTypeId || 'N/A'}
            {!isLoggedIn && <span className="text-red-500 font-semibold block mt-1"> (You must be logged in)</span>}
        </p>


        <Hotel_input_Field
          name="Check-in Date"
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          required
        />

        <Hotel_input_Field
          name="Check-out Date"
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          required
        />

        <Hotel_input_Field
          name="Number of Guests"
          type="number"
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(parseInt(e.target.value, 10) )} // <--- Added radix 10, default 1
          min="1"
          max="10" // Hardcode a reasonable max, as roomTypeDetails.maximumOccupancy is not fetched
          required
        />

        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}

        <Input_Btn type="submit" disabled={loading || !isLoggedIn}> {/* <--- Disable if not logged in */}
          {loading ? "Booking..." : "Confirm Booking"}
        </Input_Btn>
      </form>
    </div>
  );
};

export default BookingPage;