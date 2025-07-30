import React, { useEffect } from 'react'
import usehotelStore from '../store/hotelStore'
import { Link } from 'react-router-dom'

const HotelDemoPage = () => {

const {getAllHotels,hotels}=usehotelStore()


useEffect(() => {
   getAllHotels()
}, [])




  return (
    <>
    {hotels && hotels.map((hotel, idx) => (
      <>
     <Link  to={`/room/byHotel/${hotel._id}`} key={hotel._id||idx}>
     <div className='flex flex-col md:flex-row items-center gap-6 px-4 py-6 md:px-20 ' key={idx}>
        {/* Render hotel details here, e.g.: */}
         <img
          className=" w-[400px] h-[300px]   object-cover rounded-2xl shadow-lg"
          src={hotel?.image}
          alt="hotel image"
        />

        <div className="hotel_details text-center flex flex-col items-center gap-6 w-full max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FF7A30] drop-shadow-sm">
            {hotel?.name}
          </h1>

          <div className="flex flex-col md:flex-row justify-center md:justify-evenly gap-4 ">
            <h2 className="bg-[#FF7A30] text-white px-6 py-2 rounded-xl text-lg md:text-xl shadow-md">
              {hotel?.location}
            </h2>
            <h2 className="bg-[#FF7A30] text-white px-6 py-2 rounded-xl text-lg md:text-xl shadow-md  ">
              ₹{hotel?.price}
            </h2>
          </div>

          <h2 className="text-base md:text-lg text-gray-700 leading-relaxed px-2 md:px-8">
            {hotel?.description}
          </h2>
        </div>
        
      </div>
     </Link>

      </>
    ))}
    
    </>
  )
}

export default HotelDemoPage