import React from 'react'
import CardSwap, { Card } from '../components/Cardswap'
import review from "../assets/review.png"
const CustamerReview = () => {
  return (
   <div className="main_div flex flex-col md:flex-row gap-4 justify-center items-center p-2 m-1">
    <div className="left_section">

        <img className='w-64 h-auto object-cover' src={review} alt="" />
    </div>
    <div className="right_section flex flex-col text-center  w-1/2">
        <h1 className='text-2xl text-[#FF7A30] font-semibold'>Tim</h1>
        <p className='text-wrap'>truly impressed me. From the stunning lobby and quick check-in to the perfect, spotless room, every detail ensured comfort. Exceptional staff service and an ideal location made this a luxurious home away from home. Highly recommended!</p>
        </div>
    </div>
       


  )
}

export default CustamerReview