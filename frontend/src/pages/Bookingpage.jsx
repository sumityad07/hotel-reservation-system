import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useBookingStore from '../store/bookingStore';
import Hotel_input_Field from '../components/HotelInputField/Hotel_input_Field'; 
import Input_Btn from '../components/Login _button/Input_Btn'; 
import axios from 'axios'; 

const BookingPage = () => {
  const { hotelId, roomTypeId } = useParams(); // Get IDs from URL
  const navigate = useNavigate();

 
  const {
    checkInDate, setCheckInDate,
    checkOutDate, setCheckOutDate,
    numberOfGuests, setNumberOfGuests,
    // Removed: totalPrice, pricePerNight, roomTypeDetails, calculationLoading, fetchRoomTypeDetails, calculateTotalPrice

    error, message, loading, // Status indicators
    createBooking, // Async action to submit booking
    resetForm,
    setHotelId: setStoreHotelId, // Setter for hotelId in store
    setRoomTypeId: setStoreRoomTypeId, // Setter for roomTypeId in store
    setError // Get setError to display errors
  } = useBookingStore();

  // Effect to set IDs in store
  useEffect(() => {
    if (hotelId && roomTypeId) {
      setStoreHotelId(hotelId);
      setStoreRoomTypeId(roomTypeId);
      // Removed: fetchRoomTypeDetails(roomTypeId);
    } else {
      setError("Error: Hotel ID or Room Type ID not provided in URL.");
    }
    return () => {
      resetForm(); // Clear booking form on unmount
    };
  }, [hotelId, roomTypeId, resetForm, setStoreHotelId, setStoreRoomTypeId, setError]); // Removed fetchRoomTypeDetails from dependencies


  // Removed: Effect to recalculate total price

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBooking(navigate); // Call the store action to create booking
  };

  // --- Simplified Conditional Rendering ---
  // No more calculationLoading or roomTypeDetails checks
  if (loading) return <p>Confirming booking...</p>; // This 'loading' is for createBooking action
  // No longer checking roomTypeDetails === null, as we don't fetch it

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-[#3f49a5] mb-4">Book Your Room</h2>

        {/* Removed: Display of fetched roomTypeDetails */}

        {/* Check-in Date Input */}
        <Hotel_input_Field
          name="Check-in Date"
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          required
        />

        {/* Check-out Date Input */}
        <Hotel_input_Field
          name="Check-out Date"
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          required
        />

        {/* Number of Guests Input */}
        <Hotel_input_Field
          name="Number of Guests"
          type="number"
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(parseInt(e.target.value) )} // Ensure number type
          min="1"
          max="10" // Hardcode a reasonable max as roomTypeDetails.maximumOccupancy is not fetched
          required
        />

        {/* Removed: Display Total Price */}

        {/* Display errors and messages */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}

        {/* Submit Button */}
        <Input_Btn type="submit" disabled={loading}>
          {loading ? "Booking..." : "Confirm Booking"}
        </Input_Btn>
      </form>
    </div>
  );
};

export default BookingPage;