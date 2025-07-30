import React, { useEffect } from 'react';
import useBookingStore from '../store/bookingStore'; // <--- Ensure this path is correct and points to your updated store
import useAuthStore from '../store/authStore';
import moment from 'moment'; // For date formatting

const MyBooking = () => {
    // Destructure myBookings (the array of bookings) and fetchMyBookings action
    const { myBookings, loading, error, fetchMyBookings } = useBookingStore();
    const { userId } = useAuthStore(); // Get logged-in user's ID

    // This log will show 'undefined' initially if not loaded yet


    useEffect(() => {
    
        if (userId && !loading && (!myBookings || myBookings.length === 0) && !error) { // <--- CRITICAL CHECK for undefined myBookings
            console.log("Triggering fetchMyBookings for userId:", userId);
            fetchMyBookings(userId); // Call the action to fetch bookings
        } else if (!userId && myBookings && myBookings.length > 0) {
   
            console.log("User logged out or ID unavailable. Clearing myBookings.");
            useBookingStore.setState({ myBookings: [] }); // Directly reset myBookings in store if user logs out
        }
    }, [userId, loading, error, myBookings, fetchMyBookings]); // Added 'myBookings' to dependencies for safety


    // --- Conditional Rendering for UI States ---
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-[#3f49a5] font-semibold">Loading your bookings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-600 text-xl font-semibold text-center">Error: {error}</p>
            </div>
        );
    }

    // Handle case where no bookings are found after loading (or if myBookings is still not an array)
    if (!myBookings || !Array.isArray(myBookings) || myBookings.length === 0) { // <--- Added Array.isArray check
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <p className="text-gray-600 text-xl font-semibold mb-4">You have no bookings yet.</p>
                <p className="text-gray-500">Start exploring hotels to make your first reservation!</p>
            </div>
        );
    }

    // --- Main Content: Display Bookings ---
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-10 text-center text-[#FF7A30] tracking-tight">My Bookings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myBookings.map(booking => (
                    <div key={booking._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                        {/* Booking Card Header - Hotel Name & Image */}
                        <div className="relative h-40 bg-gray-200">
                            {booking.hotel?.image ? (
                                <img src={booking.hotel.image} alt={booking.hotel.name || 'Hotel Image'} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Hotel Image</div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
                                <h2 className="text-xl font-bold">{booking.hotel?.name || 'Unknown Hotel'}</h2>
                                <p className="text-sm opacity-80">{booking.hotel?.location || 'Unknown Location'}</p>
                            </div>
                        </div>

                        {/* Booking Card Body - Room & Dates */}
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{booking.roomTypeListing?.categoryName || 'Room Type'}</h3>
                            <div className="flex justify-between items-center text-gray-700 text-sm mb-3">
                                <span><i className="fas fa-calendar-alt mr-1"></i> Check-in: {moment(booking.checkInDate).format('MMM Do, YYYY')}</span>
                                <span><i className="fas fa-calendar-alt mr-1"></i> Check-out: {moment(booking.checkOutDate).format('MMM Do, YYYY')}</span>
                            </div>
                            <p className="text-gray-700 mb-3"><i className="fas fa-users mr-1"></i> Guests: {booking.numberOfGuests}</p>

                            {/* Price & Status */}
                            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                <p className="text-xl font-bold text-green-600">${booking.totalPrice?.toFixed(2)}</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {booking.status?.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Booking Card Footer - ID & Date */}
                        <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 flex justify-between items-center">
                            <span>Booking ID: {booking._id?.substring(0, 8)}...</span>
                            <span>Booked: {moment(booking.createdAt).format('YYYY-MM-DD')}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBooking;