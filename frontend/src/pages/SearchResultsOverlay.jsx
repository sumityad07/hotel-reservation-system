import React from 'react';
import { Link } from 'react-router-dom';

const SearchResultsOverlay = ({ results }) => {
  if (!results || results.length === 0) {
    return null; // Don't render if no results
  }

  return (
    // Position this dropdown absolutely below the search bar
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
      <ul className="divide-y divide-gray-200">
        {results.map(hotel => (
          <li key={hotel._id} className="p-3 hover:bg-gray-100 cursor-pointer">
            <Link to={`/roomListing/${hotel._id}`} className="flex items-center space-x-3 text-gray-800 hover:text-blue-600 transition-colors">
              {hotel.image && <img src={hotel.image} alt={hotel.name} className="w-10 h-10 object-cover rounded" />}
              <div>
                <p className="font-semibold">{hotel.name}</p>
                <p className="text-sm text-gray-500">{hotel.location}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultsOverlay;