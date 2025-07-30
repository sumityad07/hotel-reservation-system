import React, { useState, useEffect } from 'react'
import Input_Btn from '../components/Login _button/Input_Btn'
import Profile_pic from "../assets/profile_pic.png"
import Booking_btn from '../components/booking button/Booking_btn'
import tower from '../assets/tower.png'
import md_profile from '../assets/md_profile.png'
import md_travel from '../assets/md_travel.png'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useHotelStore from '../store/hotelStore';
import axios from 'axios';

const Profile = () => {
  const { logout, userRole, userId } = useAuthStore();
  const navigate = useNavigate();

  const { ownedHotels, ownerHotel, loading: hotelStoreLoading, error: hotelStoreError, setOwnedHotels } = useHotelStore(); // Also destructure setOwnedHotels if you clear it locally

  // --- CRITICAL FIX: Add a guard condition to useEffect ---
  useEffect(() => {
    // Only fetch if user is logged in as owner/admin AND
    // if ownedHotels is currently empty AND not already loading or has an error (to prevent re-fetching endlessly)
    if (userId && (userRole === 'owner' || userRole === 'admin') &&
        ownedHotels.length === 0 && !hotelStoreLoading && !hotelStoreError) { // <--- GUARD CONDITION
      ownerHotel(); // Call the action to fetch owned hotels
    }
    // You might want an else-if here if you want to clear ownedHotels when userRole/userId changes away from owner/admin
    // else if ((!userId || (userRole !== 'owner' && userRole !== 'admin')) && ownedHotels.length > 0) {
    //     setOwnedHotels([]); // Clear owned hotels if user logs out or role changes
    // }

  }, [userId, userRole, ownerHotel, ownedHotels.length, hotelStoreLoading, hotelStoreError]); // Add ownedHotels.length to dependencies

  const handlechange = () => {
    logout(navigate);
  };

  const shouldShowMyHotelsButton = (userRole === 'owner' || userRole === 'admin') && ownedHotels && ownedHotels.length > 0;
  const myHotelsButtonText = hotelStoreLoading ? "Loading Your Hotels..." : "My Hotels";


  return (
    <>
      {/* mobile view */}
      <div className='block md:hidden relative'>
        <div className="main_div flex flex-col justify-center ">
          <div className='flex flex-col justify-center text-center items-center p-3'>
            <h1 className='text-4xl font-bold ' >Hotel Plans a click Away</h1>
            <div className="w-[142px] h-[152px] relative border-[1px] rounded-full overflow-hidden">
              <img className="w-full h-full object-cover" src={Profile_pic} alt="profile pic" />
            </div>
          </div>

          <div>
            <div className='flex flex-col gap-4 justify-center items-center text-center '>
              <Input_Btn onClick={handlechange} name="Logout" />
              <Link to ="my-bookings">
              <Booking_btn name="My Booking" />
              </Link>
              <Link to="/PublishedHotel">
                <Booking_btn className='border-[3px] border-[#3f4a9a] w-[200px]' name="Published Hotel" />
              </Link>
              {hotelStoreError && <p className="text-red-500">{hotelStoreError}</p>}
              {shouldShowMyHotelsButton && (
                <Link to={`/roomListing/${ownedHotels[0]._id}`}>
                  <Input_Btn className='border-[3px] border-[#3f4a9a] w-[200px]' name={myHotelsButtonText} /> {/* Use isFetchingOwnedHotels from component's local state, if using store's loading, use hotelStoreLoading */}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="absolute w-full h-2/3 mt-2 rounded-t-full overflow-hidden">
          <img className="w-full h-full object-cover" src={tower} alt="tower" />
        </div>
      </div>

      {/* dekstop view */}
      <div className='hidden relative md:block h-[576px] md:flex flex-col'>
        <div className=" ml-5 main_section md:flex justify-between items-center">
          <div className="left_side flex flex-col gap-12 items-center w-1/3">
            <h1 className='text-4xl font-semibold'>
              Hotel Plans a Click Away
            </h1>
            <div className='w-32 h-32 rounded-full relative overflow-hidden' >
              <img className='absolute w-full h-full object-fill' src={md_profile} alt="" />
            </div>

            <Link to="/PublishedHotel">
              <Input_Btn className='w-36' name="Published Hotel" />
            </Link>
            {hotelStoreError && <p className="text-red-500">{hotelStoreError}</p>}
            {shouldShowMyHotelsButton && (
              <Link to={`/roomListing/${ownedHotels[0]._id}`}>
                <Input_Btn className='w-36' name={myHotelsButtonText}  />
              </Link>
            )}

          </div>

          <div className='flex justify-center items-center '>
            <Link to ="my-bookings" className='w-[600px]'>
              <Booking_btn name="Booking" />
            </Link>
            <img loading='lazy' className='h-[576px] w-full object-fit' src={md_travel} alt="" />
          </div>
        </div >
      </div>
    </>
  );
};

export default Profile;