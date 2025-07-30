import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div
        className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"
      ></div>
      <p className="text-blue-500">Loading...</p>
    </div>
  );
};

export default Loader;