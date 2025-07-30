import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Added Link import
import useRoomStore from '../store/roomstore'; // Adjust path if needed
import occupency from "../assets/occupency.png"
import Input_Btn from '../components/Login _button/Input_Btn';

const RoomByHotel = () => {
    // --- CRITICAL FIX: Destructure hotelId, not id ---
    const { hotelId } = useParams(); // <--- Get hotelId from URL params

 // Now this should show the correct ID

    const { rooms, getRooms } = useRoomStore(); // Your room store and action

    useEffect(() => {
        if (!hotelId) { // Check for hotelId
            console.log("No hotel ID provided in the URL.");
            return;
        }
        getRooms(hotelId);
    }, [hotelId, getRooms]); 

// Log the rooms array

    return (
        <>
            
            {rooms && rooms.length > 0 ?  (
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
                                                   <Link className='m-4' to ={`/book/${hotelId}/${room._id}`}>
                                                   <Input_Btn name="Booking" />
                                                   </Link>
                                               </div>
                                           </div>
                                       ))}
                                   </div>
                               ) : (
                                   <p className="mt-4 text-center">No room types added yet for this hotel.</p>
                               )}
           
           
        </>
    );
};

export default RoomByHotel;