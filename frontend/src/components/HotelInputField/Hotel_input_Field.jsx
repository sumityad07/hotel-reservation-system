import React from 'react';

const Hotel_input_Field = ({ name, field = "text", className = "", ...props }) => {
  return (
    <>
      {field === "textarea" ? (
        <textarea
          className={`border-[2px] border-[#231c1c] rounded-lg px-3 py-2 ${className}`}
          placeholder={name}
          {...props}
        />
      ) : (
        <input
          type={field}
          className={`border-[2px] border-[#231c1c] h-10 rounded-3xl px-3 ${className}`}
          placeholder={name}
          {...props}
        />
      )}
    </>
  );
};

export default Hotel_input_Field;
