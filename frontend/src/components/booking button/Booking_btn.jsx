import React from 'react'

const Booking_btn = ({children,className="" ,...props}) => {
  return (
    <button {...props} className={`border-[2px] rounded-r-lg w-1/2 text-center p-2 text-bold ${className} `}   >
       {children||props.name}
    </button>
  )
}

export default Booking_btn