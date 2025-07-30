import React from 'react';

const Button = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="w-[110px] border-2 text-center border-[#FF7A30] rounded-lg font-semibold hover:bg-[#FF7A30] hover:text-white transition duration-300"
    >
      {children || props.name}
    </button>
  );
  
};

export default Button;