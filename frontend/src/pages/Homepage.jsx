import React from 'react'

import tagline1 from "../assets/tagline_full.png"
import mobile_tagline from  "../assets/mobile_tagline.png"
import HotelDemoPage from './HotelDemoPage'
import CustamerReview from './CustamerReview'
import place from '../assets/place.png'
import places from '../assets/places.png'

const Homepage = () => {
  return (
    <>
      <div className="relative">
        <img className="hidden md:block md:w-full  w-full h-full   " src={tagline1} alt="hotel image" />
        <img className='block md:hidden w-full h-full object-cover' src={mobile_tagline} alt="" />

        <h1 className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:text-white text-xl md:text-7xl font-bold text-center ">
          Where Every Stay Feels Like Home
        </h1>
      </div>
      <HotelDemoPage/>
      <CustamerReview/>
      <img className='hidden md:block px-16 w-full' src={place}alt="" />
      <img className='block md:hidden' src={places} alt="" />
      
      
    
    </>
  )
}

export default Homepage