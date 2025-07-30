import React from 'react'

const Input_Btn = ({children, className="",...props}) => {
  return (
    <>
     <button
      {...props} 
      className={`border-[1px] rounded-xl h-12 w-32 flex items-center justify-center px-3 font-thin text-md text-start bg-[#505ABB] text-white ${className} hover:-translate-y-1 hover:shadow-lg hover:bg-[#3f4a9a]  `}
    >
      {children || props.name} {/* Renders content passed as children, or falls back to 'name' prop */}
    </button>
        
    </>
  )
}

export default Input_Btn