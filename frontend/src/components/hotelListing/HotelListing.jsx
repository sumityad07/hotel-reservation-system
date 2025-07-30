import React from 'react'
import usehotelStore from '../../store/hotelStore';

const HotelListing = () => {
  const {
    currentHotel,
    currentHotelError,
    loading,
    hotelDetails,
    setCurrentHotelError
  } = usehotelStore();

  return (
    <>
      {/* mobile view */}

      <div className="main_div flex flex-col items-center gap-6 px-4 py-6 md:px-20 ">
        <img
          className=" w-[400px] h-[300px]   object-cover rounded-2xl shadow-lg"
          src={currentHotel?.image}
          alt="hotel image"
        />

        <div className="hotel_details text-center flex flex-col items-center gap-6 w-full max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FF7A30] drop-shadow-sm">
            {currentHotel?.name}
          </h1>

          <div className="flex flex-col md:flex-row justify-center md:justify-between gap-4 w-full">
            <h2 className="bg-[#FF7A30] text-white px-6 py-2 rounded-xl text-lg md:text-xl shadow-md w-full md:w-[45%]">
              {currentHotel?.location}
            </h2>
            <h2 className="bg-[#FF7A30] text-white px-6 py-2 rounded-xl text-lg md:text-xl shadow-md w-full md:w-[45%]">
              ₹{currentHotel?.price}
            </h2>
          </div>

          <h2 className="text-base md:text-lg text-gray-700 leading-relaxed px-2 md:px-8">
            {currentHotel?.description}
          </h2>
        </div>
      </div>


    </>


  )
}

export default HotelListing

