import Hotel from "../../models/Hotels/hotels.Info.js";


//create hotel info controller
export const hotelRegister = async (req, res) => {

    // Destructure all expected fields
    const {name, price,  description, image, location} = req.body;
    const owner = req.user?.id; // This should be populated now

    //log all inpist comes from frontend with truth value
    console.log("Received data:", {name, price, description, image, location, owner});
    
    

    if(!name || !price || !description || !image || !location || !owner) {
        console.error("!!! BACKEND VALIDATION FAILED: ONE OR MORE REQUIRED FIELDS ARE MISSING OR FALSY !!!"); // <--- This confirms the 400 path
        return res.status(400).json({message: "All fields (name, price, rating, description, image, location, owner) are required."});
    }

    try {
 
        const existingHotel = await Hotel.findOne({name});
        if(existingHotel) {
            return res.status(400).json({message: "Hotel with this name already exists."});
        }
        const newHotel = new Hotel({
            name, price, description, image, location, owner, status: 'pending' // Default status
        });
        await newHotel.save();
        console.log("Hotel registered successfully in DB:", newHotel);
        return res.status(201).json({message: "Hotel submitted for approval successfully!", hotel: newHotel});

    } catch (error) {
        console.error("Error caught during hotel save to DB:", error); // Error in Mongoose/DB
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, details: error.errors });
        }
        return res.status(500).json({message: "Internal server error", error: error.message || error});
    }
};



//all hotel details
export const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        if (!hotels || hotels.length === 0) {
            return res.status(404).json({ message: "No hotels found" });
        }
        return res.status(200).json(hotels);
    } catch (error) {
        console.error("Error fetching hotels:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getHotelById = async (req, res) => {
    const hotelId = req.params.id;
    console.log("--- Backend: getHotelById with Role Check ---");
    console.log("Fetching hotel ID:", hotelId);
    console.log("Logged-in user (req.user):", req.user); // Should contain id and role

    try {
        // Step 1: Fetch the hotel by ID, populate owner details
        // We'll get the status and owner ID here to make decisions
        const hotel = await Hotel.findById(hotelId).populate('owner', 'email'); // Populate owner email

        // If hotel doesn't exist at all, return 404
        if (!hotel) {
            console.log(`Hotel ${hotelId} not found.`);
            return res.status(404).json({ message: "Hotel not found." });
        }

        // Step 2: Determine if the logged-in user has special viewing privileges
        const loggedInUserId = req.user.id; // From your JWT payload
        const loggedInUserRole = req.user.role; // From your JWT payload

        const isHotelOwner = loggedInUserId === hotel.owner._id.toString(); // Compare IDs (convert owner _id to string)
        const isAdmin = loggedInUserRole === 'admin';

        console.log(`Hotel ${hotelId} Status: ${hotel.status}`);
        console.log(`Logged-in User ID: ${loggedInUserId}, Role: ${loggedInUserRole}`);
        console.log(`Is Hotel Owner: ${isHotelOwner}, Is Admin: ${isAdmin}`);

        // Step 3: Apply Conditional Visibility Logic
        if (
            hotel.status === 'approved' || // Anyone can see approved hotels
            isHotelOwner ||                 // The owner can see their own hotels (regardless of status)
            isAdmin                         // An admin can see any hotel (regardless of status)
        ) {
            console.log(`Access granted for hotel ${hotelId}. Status: ${hotel.status}`);
            return res.status(200).json(hotel); // Send the hotel data
        } else {
            // If status is not 'approved', AND not the owner, AND not an admin
            console.log(`Access denied for hotel ${hotelId}. Status: ${hotel.status}, User not owner/admin.`);
            return res.status(403).json({ message: "Access denied. This hotel is not yet publicly visible or you do not have permission." }); // 403 Forbidden
        }

    } catch (error) {
        console.error(`Error fetching hotel with ID ${hotelId}:`, error);
        if (error.name === 'CastError') { // Invalid ID format
             return res.status(400).json({ message: 'Invalid Hotel ID format.' });
        }
        return res.status(500).json({ message: "Internal server error." });
    }
};      

export const getByHotelName = async (req, res) => {
    const hotelName = req.params.name;
    try {
        const hotel = await Hotel.findOne({ name: hotelName });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        return res.status(200).json(hotel);
    } catch (error) {
        console.error("Error fetching hotel by name:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteHotel = async (req, res) => {
    const hotelId = req.params.id;
    try {
        const hotel = await Hotel.findByIdAndDelete(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        return res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (error) {
        console.error("Error deleting hotel:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const updateHotel = async (req, res) => {
    const hotelId = req.params.id;
    const updateData = req.body;
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updateData, { new: true });
        if (!updatedHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        return res.status(200).json(updatedHotel);
    } catch (error) {
        console.error("Error updating hotel:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// controllers/hotelController.js (Add this function)


export const getHotelsByOwner = async (req, res) => {
    console.log("--- Backend: getHotelsByOwner Controller Hit ---");
    console.log("req.user from protect middleware:", req.user); // Should be populated
    
    const ownerId = req.user?.id; // Use .id or ._id based on your JWT payload

    console.log("Owner ID being queried in DB:", ownerId); // <--- CRITICAL LOG: Confirm this is the ID

    if (!ownerId) {
        console.error("ERROR: Owner ID is missing in getHotelsByOwner (req.user.id is undefined/null).");
        return res.status(400).json({ message: "Owner ID is required to fetch owned hotels." });
    }

    try {
        // --- ADD THESE LOGS ---
        const ownedHotels = await Hotel.find({ owner: ownerId }); // The actual database query
        console.log("Database query result for owned hotels:", ownedHotels); // <--- CRITICAL LOG: This will show if hotels are found
        console.log("Number of owned hotels found:", ownedHotels.length);
        // --- END LOGS ---

        return res.status(200).json(ownedHotels); // Returns the array of hotels
    } catch (error) {
        console.error("Error fetching hotels by owner:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


export const searchHotels = async (req, res) => {
  const { query } = req.query; // Get query from URL parameter like ?query=text

  if (!query) {
    return res.status(200).json([]); // Return empty array if no query
  }

  try {
    // Basic search: Find hotels where name, description, or location contains the query text (case-insensitive)
    const hotels = await Hotel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ],
      status: 'approved' // Only search within approved hotels
    });

    return res.status(200).json(hotels);
  } catch (error) {
    console.error("Error during hotel search:", error);
    return res.status(500).json({ message: 'Internal server error during search.' });
  }
};