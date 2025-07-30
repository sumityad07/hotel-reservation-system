import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // Import Link
import axios from 'axios'; // Or axiosInstance if you're using a backend search API
import Loader from "../components/Loader/Loader"; // Your Loader component

import useHotelStore from '../store/hotelStore'; // Correct import for useHotelStore

const SearchedHotelPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  // Use the loading and error states from your hotelStore
  const {
    getAllHotels,
    hotels: allHotels, // Renamed for clarity to avoid conflict with local filteredResults
    hotelsLoading,   // Loading state for fetching ALL hotels
    hotelsError,     // Error state for fetching ALL hotels
  } = useHotelStore();

  const [filteredResults, setFilteredResults] = useState([]); // Local state for the filtered search results

  useEffect(() => {
    const fetchAndFilterHotels = async () => {
      // If query is empty, clear results and stop
      if (!query) {
        setFilteredResults([]);
        // setLoading(false); // No need for local loading now
        return;
      }

      // We use hotelStore's hotelsLoading/Error and local filteredResults state
      // setLoading(true); // No need for local loading
      // setError(null); // No need for local error

      try {
        // --- IMPORTANT: Ensure allHotels are fetched ---
        // If allHotels are not loaded yet or there was an error fetching them,
        // trigger the fetch. The actual filtering happens after allHotels are available.
        if (!allHotels || allHotels.length === 0 || hotelsError) {
          // You could show a specific message or trigger a re-fetch here
          // if (!hotelsLoading && !hotelsError) { // Prevent re-fetching if already loading/error
          //   await getAllHotels(); // Trigger fetch of all hotels
          // }
          // This line will ensure all hotels are fetched or loading is managed by the store
          await getAllHotels();
          if (hotelsError) {
            // If fetching all hotels failed, set local error for search results
            setError(hotelsError); // Assuming you keep a local error state, or rely on store's
            setLoading(false);
            return;
          }
        }

        // --- Client-side filtering logic ---
        // Access allHotels directly after ensuring it's available (or after fetch)
        const hotelsToFilter = allHotels || []; // Ensure it's an array for filter
        const lowerCaseQuery = query.toLowerCase().trim();
        const results = hotelsToFilter.filter(hotel =>
            hotel.name?.toLowerCase().includes(lowerCaseQuery) || // Use optional chaining
            hotel.location?.toLowerCase().includes(lowerCaseQuery) ||
            hotel.description?.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredResults(results);

      } catch (err) {
        // This catch block handles errors related to filtering itself, or unexpected issues
        console.error("Error during client-side filtering:", err);
        setError("Failed to process search results locally.");
      } finally {
        // setLoading(false); // No need for local loading
      }
    };

    fetchAndFilterHotels();
  }, [query, getAllHotels, allHotels, hotelsError]); // Add allHotels and hotelsError to dependencies

  // --- Use hotelsLoading from store ---
  if (hotelsLoading) return <Loader />;
  // --- Use hotelsError from store ---
  if (hotelsError) return <p className="text-red-500 text-center mt-10">{hotelsError}</p>;

  return (
    <div className="searched-hotel-page p-4 py-10 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#3f49a5]">Search Results for "{query}"</h1>
      {/* Use filteredResults here */}
      {filteredResults.length === 0 ? (
        <p className="text-center text-gray-600">No hotels found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map(hotel => (
            <div key={hotel._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <Link to={`/room/byHotel/${hotel._id}`} className="block p-4">
                {hotel.image && <img src={hotel.image} alt={hotel.name || "Hotel Image"} className="w-full h-40 object-cover mt-2 rounded mb-3" />}
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{hotel.name}</h2>
                <p className="text-gray-700 text-sm">{hotel.location}</p>
                <p className="text-gray-600 text-xs mt-2">{hotel.description?.substring(0, 100)}...</p>
                <p className="text-green-600 font-bold mt-2">₹{hotel.price}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchedHotelPage;