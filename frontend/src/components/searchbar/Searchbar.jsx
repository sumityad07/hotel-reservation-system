import React from 'react'
import searchlogo from '../../assets/searchLogo.png'

const Searchbar = ({...props}) => {
  return (
   <>
   <div {...props} className='flex items-center gap-2  rounded-lg px-2 py-1'>
    <input {...props} className='border-[1px] border-black bg-[#F4EEE2] rounded-lg text-start p-1'  type="text" placeholder='location' name="location" id=""  />
    <img src={searchlogo} alt="" />
   </div>
   </>
  )
}

export default Searchbar