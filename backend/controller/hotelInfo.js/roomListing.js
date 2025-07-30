
import Hotel from "../../models/Hotels/hotels.Info.js";
import RoomTypeListing from "../../models/Hotels/room.js";
export const createRoomTypeListing = async (req , res)=>{
    const { hotel, categoryName, price, description, image, maximumOccupancy, freeEntities, category } = req.body;

    if (!hotel || !categoryName || !price || !description || !image || !maximumOccupancy || !freeEntities || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const registeredHotel = await Hotel.findById(hotel);
        if (!registeredHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        // Check if the room type already exists for the hotel
        const existingRoomType = await RoomTypeListing.findOne({ hotel, categoryName });
        if (existingRoomType) {
            return res.status(400).json({ message: "Room type already exists for this hotel" });
        }
        // Create a new room type listing

        const newRoomType = new RoomTypeListing({
            hotel,
            categoryName,
            price,
            description,
            image,
            maximumOccupancy,
            freeEntities,
            category
        });

        await newRoomType.save();
        return res.status(201).json({ message: "Room type created successfully", roomType: newRoomType });
    } catch (error) {
          if (error.code === 11000) {
            return res.status(409).json({
                message: `A room type listing with category "${categoryName}" already exists for this hotel (database conflict).`,
                details: error.message
            });
        }

        console.error("Error creating room type:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

//get all room type listings for a hotel
export const getRoomTypeListingsByHotel = async (req, res) => {
    const { hotelId } = req.params; // Get hotel ID from URL parameter

    try {
        // Find all room types associated with this hotel ID
        const roomTypes = await RoomTypeListing.find({ hotel: hotelId })
                                            .populate('hotel', 'name image'); // Optionally populate hotel name/image if needed on frontend
                                            // You might also add a status filter if room types also have statuses
                                            // .where('status').equals('approved');

        if (!roomTypes || roomTypes.length === 0) {
            return res.status(200).json({ message: "No room types found for this hotel.", roomTypes: [] }); // Send empty array if none
        }

        return res.status(200).json(roomTypes);
    } catch (error) {
        console.error("Error fetching room types by hotel ID:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

//get room type listing by id
export const getRoomTypeListingById = async (req, res) => {
    try {
        const roomTypeId = req.params.id;
        const roomType = await RoomTypeListing.findById(roomTypeId);
        if (!roomType) {
            return res.status(404).json({ message: "Room type listing not found" });
        }
        return res.status(200).json(roomType);
    } catch (error) {
        console.error("Error fetching room type listing:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

//update room type listing
export const updateRoomTypeListing = async (req, res) => {
    try {
        const roomTypeId = req.params.id;
        const updateData = req.body;

        const updatedRoomType = await RoomTypeListing.findByIdAndUpdate(roomTypeId, updateData, { new: true });
        if (!updatedRoomType) {
            return res.status(404).json({ message: "Room type listing not found" });
        }
        return res.status(200).json({ message: "Room type listing updated successfully", roomType: updatedRoomType });

    } catch (error) {   
        console.error("Error updating room type listing:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

//delete room type listing
export const deleteRoomTypeListing = async (req, res) => {
    try {
        const roomTypeId = req.params.id;
        const deletedRoomType = await RoomTypeListing.findByIdAndDelete(roomTypeId);
        if (!deletedRoomType) {
            return res.status(404).json({ message: "Room type listing not found" });
        }
        return res.status(200).json({ message: "Room type listing deleted successfully" });
    } catch (error) {
        console.error("Error deleting room type listing:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
