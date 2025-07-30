import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useHotelStore from '../store/hotelStore';
import axios from 'axios';
import HotelListing from '../components/hotelListing/HotelListing';
import Input_Btn from '../components/Login _button/Input_Btn';
import signupLogo from "../assets/signupLogo.png"
import useRoomStore from '../store/roomstore';
import occupency from '../assets/occupency.png'

const RoomListing = () => {
    const { id } = useParams();
    const { userRole, userId } = useAuthStore();

    const {
        currentHotel,
        currentHotelError,
        loading, // This is currentHotel loading
        hotelDetails,
        setCurrentHotelError,
        setLoading,
        // <--- Corrected: use getRooms (camelCase)
    } = useHotelStore();

    const { rooms, getRooms } = useRoomStore()

    console.log("rooms", rooms); // Should now log the array of rooms

    useEffect(() => {
        const fetchHotelAndRooms = async () => {
            if (!id) {
                setCurrentHotelError("No hotel ID provided in the URL.");
                setLoading(false); // Stop loading if no ID
                return;
            }

            // --- Fetch Hotel Details ---
            setLoading(true); // Start general loading for both fetches
            setCurrentHotelError('');
            try {
                await hotelDetails(id); // Fetch hotel details first
            } catch (error) {
                console.error("Component: Failed to fetch hotel:", error);
            } finally {
                // setLoading(false); // Don't set false until *both* are fetched, or use separate loading states
            }

            // --- Fetch Room Types for this Hotel ---
            try {
                await getRooms(id); // <--- Corrected: use getRooms (camelCase) and pass hotelId
            } catch (err) {
                console.error("Component: Failed to fetch room types:", err);
                // Error handled by store; store will set error state
            } finally {
                setLoading(false); // Set loading false after ALL fetches
            }
        };

        fetchHotelAndRooms();
    }, [id, hotelDetails, setCurrentHotelError, setLoading, getRooms]); // Added getRooms to dependencies

    // Combine loading states from hotel and rooms if they were separate
    // if (loading || roomTypesLoading) return <p>Loading hotel and room details...</p>;
    if (loading) return <p>Loading hotel and room details...</p>; // Assuming 'loading' covers both now
    if (currentHotelError) return <p className="text-red-500">{currentHotelError}</p>;
    // Removed roomTypesError from here, assuming getRooms sets store.error now
    if (!currentHotel) return <p>Hotel not found or no data available.</p>;

    const isOwner = userId === currentHotel.owner?._id.toString();
    const normalizedStatus = currentHotel.status?.trim()?.toLowerCase();

    const isApproved = normalizedStatus === 'approved';
    const isPending = normalizedStatus === 'pending';
    const isRejected = normalizedStatus === 'rejected';

    const renderHotelContent = () => {
        if (isApproved) {
            return (
                <>
                    <div className='md:flex justify-between'>
                        <HotelListing hotel={currentHotel} />
                        <img className='hidden md:block w-auto h-auto object-cover' src={signupLogo} alt="Hotel Visual" />
                    </div>
                    {/* "Add New Room Type" button for Approved Hotels */}
                    {(isOwner || userRole === 'owner' || userRole === 'admin') && (
                        <div className="flex justify-center mt-4">
                            <Link to={`/create-room-type/${currentHotel._id}`}>
                                <Input_Btn name="Add New Room Type" />
                            </Link>
                        </div>
                    )}

                    {/* Display Room Types for Approved Hotels */}
                    {rooms && rooms.length > 0 ? (
                        <div className="room-types-list mt-8">
                            <h3 className="text-2xl font-bold mb-4">Available Room Types:</h3>
                            {rooms.map(room => (
                                <div key={room._id} className="flex flex-col md:flex-row justify-between md:justify-evenly items-center  text-center m-2">
                                    <div className="left_side flex flex-col gap-2 items-center">
                                        <h2 className="text-white text-center bg-[#FF7A30] text-lg font-bold w-16 rounded-lg p-2">{room.price}</h2>
                                        <img className="w-[90%] ] h-auto rounded-2xl" src={room.image} alt="" />
                                    </div>

                                    <div className="right_side flex flex-col items-center md:items-start md:ml-4">
                                        <h1 className="text-lg text-[#FF7A30] font-semibold md:text-center">{room.categoryName}</h1>

                                        {/* Group features + description together */}
                                        <div className="w-full md:w-60 flex flex-col items-center md:items-start">
                                            <div className="flex justify-between gap-4 mb-2 w-full">
                                                <h2 className="text-base">{room.freeEntities}</h2>
                                                <h2 className="text-base">{room.category}</h2>
                                                <div className="flex gap-1 items-center">
                                                    <h2 className="text-base">{room.maximumOccupancy}</h2>
                                                    <img className="w-6 h-auto rounded-lg" src={occupency} alt="" />
                                                </div>
                                            </div>
                                            <h2 className="text-xs text-left">{room.description}</h2>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-center">No room types added yet for this hotel.</p>
                    )}



                </>
            );
        } else if (isPending) {
            return (
                <div className="pending-owner-view p-4 text-center">
                    <p className="text-orange-500 text-lg font-semibold">Your hotel "{currentHotel.name}" is currently pending approval.</p>
                    <p>It will be visible on the app once approved by an admin.</p>
                    {/* Display basic hotel info even if pending */}
                    <p className="text-sm text-gray-600 mt-2">Price: ${currentHotel.price}</p>
                    <p className="text-sm text-gray-600">Description: {currentHotel.description}</p>
                    {currentHotel.image && <img src={currentHotel.image} alt="Preview" className="mx-auto mt-2 h-20 w-auto object-cover rounded" />}

                    {/* "Add New Room Type" button for Pending Hotels (only for owner/admin) */}
                    {(isOwner || userRole === 'owner' || userRole === 'admin') && (
                        <div className="flex justify-center mt-4">
                            <Link to={`/create-room-type/${currentHotel._id}`}>
                                <Input_Btn name="Add New Room Type (Pending Hotel)" />
                            </Link>
                        </div>
                    )}
                </div>
            );
        } else if (isRejected) {
            if (isOwner || userRole === 'owner' || userRole === 'admin') {
                return <p className="text-red-500 text-lg font-semibold text-center">Your hotel "{currentHotel.name}" has been **rejected**. Please review the guidelines or contact support.</p>;
            } else {
                return <p className="text-center">This hotel is not available.</p>;
            }
        }
        return <p className="text-center">Hotel details unavailable or status unknown.</p>;
    };

    return (
        <div className="roomlisting-page pb-4">
            {renderHotelContent()}
        </div>
    );
};

export default RoomListing;