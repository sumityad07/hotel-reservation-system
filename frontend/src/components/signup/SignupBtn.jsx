import React from 'react'

const SignupBtn = (props) => {
  return (
    <>
      <input
        className="border-[1px] border-black h-12 w-auto rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300 px-3 font-thin text-md text-start"
        type={props.type || 'text'} 
        placeholder={props.name}
        value={props.value}      
        onChange={props.onChange} 
      />


    </>

  )
}

export default SignupBtn