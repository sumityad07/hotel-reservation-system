import Booking from "../../models/booking/booking.js";
import RoomTypeListing from "../../models/Hotels/room.js";
import Hotel from "../../models/Hotels/hotels.Info.js";


//crete booking for users
export const createBooking = async (req, res) => {
    // --- CRITICAL FIX 1: Destructure roomTypeListingId correctly ---
    // If frontend sends 'roomTypeListing' as the key, destructure it as such
    const { roomTypeListing, checkInDate, checkOutDate, numberOfGuests } = req.body;

    const userId = req.user.id;
    console.log('5. createBooking: Controller hit!');
    console.log('6. createBooking: req.user at start of controller:', req.user);
    console.log('7. createBooking: req.body received:', req.body); // Check actual received payload


    if (!userId) {
        console.error("ERROR: User ID missing from req.user (auth failed or not provided).");
        return res.status(400).json({ message: 'User ID is required' });
    }

    // Now 'roomTypeListing' contains the ID, use it for validation
    if (!roomTypeListing || !checkInDate || !checkOutDate || !numberOfGuests) {
        console.error('ERROR: Missing required booking details:', { roomTypeListing, checkInDate, checkOutDate, numberOfGuests });
        return res.status(400).json({ message: 'All required booking details (roomTypeListing, checkInDate, checkOutDate, numberOfGuests) must be provided.' });
    }

    try {
        const parsedCheckInDate = new Date(checkInDate);
        const parsedCheckOutDate = new Date(checkOutDate);
        const nowDate = new Date();
        nowDate.setHours(0, 0, 0, 0);

        if (parsedCheckInDate < nowDate) { return res.status(400).json({ message: 'Check-in date cannot be in the past.' }); }
        if (parsedCheckOutDate <= parsedCheckInDate) { return res.status(400).json({ message: 'Check-out date must be strictly after check-in date.' }); }
        if (numberOfGuests < 1) { return res.status(400).json({ message: 'Number of guests must be at least 1.' }); }

        // Use the correctly destructured 'roomTypeListing' here
        const roomListingDetails = await RoomTypeListing.findById(roomTypeListing).populate('hotel'); // <--- CRITICAL FIX: Use 'roomTypeListing'
        if (!roomListingDetails) {
            console.error(`ERROR: Selected room type listing ID ${roomTypeListing} not found.`);
            return res.status(404).json({ message: 'Selected room type listing not found.' });
        }

        if (numberOfGuests > roomListingDetails.maximumOccupancy) { // Use roomListingDetails
            return res.status(400).json({ message: `Number of guests (${numberOfGuests}) exceeds the maximum occupancy of ${roomListingDetails.maximumOccupancy} for this room type.` });
        }

        const oneDay = 24 * 60 * 60 * 1000;
        const differenceInDays = Math.ceil(Math.abs(parsedCheckOutDate.getTime() - parsedCheckInDate.getTime()) / oneDay);
        const totalPrice = roomListingDetails.price * differenceInDays; // Use roomListingDetails.price

        const newBooking = new Booking({
            user: userId,
            hotel: roomListingDetails.hotel._id, // Use roomListingDetails.hotel
            // --- CRITICAL FIX 2: Remove 'room' field, keep only 'roomTypeListing' ---
            roomTypeListing: roomTypeListing, // This matches your schema
            checkInDate: parsedCheckInDate,
            checkOutDate: parsedCheckOutDate,
            numberOfGuests,
            totalPrice,
            status: 'pending'
        });

        const savedBooking = await newBooking.save();
        console.log('Booking created and saved:', savedBooking);
        return res.status(201).json({ message: 'Booking created successfully', booking: savedBooking });

    } catch (error) {
        console.error('Error in createBooking try-catch block:', error); // Log the full error object
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid ID format for room type listing." });
        }
        if (error.name === 'ValidationError') { // Catch Mongoose validation errors
            return res.status(400).json({ message: error.message, details: error.errors });
        }
        return res.status(500).json({ message: 'Internal server error', error: error.message }); // Generic 500
    }
};

export const getBookingById = async (req, res) => {
    const { id } = req.params; // Booking ID from URL
    console.log("Fetching booking with ID:", id);

    try {
        const booking = await Booking.findById(id)
                                    .populate('user', 'email username') // Populate user details
                                    .populate('hotel', 'name location image') // Populate hotel details (name, location, image)
                                    .populate('roomTypeListing', 'categoryName price maximumOccupancy image description'); // Populate room type details

        if (!booking) {
            console.log(`Booking ${id} not found.`);
            return res.status(404).json({ message: "Booking not found." });
        }

        console.log("Fetched booking:", booking);
        return res.status(200).json(booking);
    } catch (error) {
        console.error(`Error fetching booking by ID ${id}:`, error);
        if (error.name === 'CastError') {
             return res.status(400).json({ message: 'Invalid Booking ID format.' });
        }
        return res.status(500).json({ message: "Internal server error." });
    }
};
//finding booking by userId
export const getBookingsByUserId = async (req, res) => {
    const userId = req.user.id; // Assuming userId is stored in req.userId after authentication
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try{
        const bookings = await Booking.find({user: userId }).populate('hotel', 'name location image').populate('roomTypeListing', 'categoryName price maximumOccupancy image');
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this user' });
        }
        return res.status(200).json(bookings);
    }
    catch (error) {
         if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid User ID format." });
        }
        console.error('Error fetching bookings:', error);
        return res.status(500).json({ message: 'Internal server error',error: error.message });
    }
}


export const updateBookingStatus = async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    const loggedInUserId = req.user.id;
    const loggedInUserRole = req.user.role;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!status || !validStatuses.includes(status.toLowerCase())) { return res.status(400).json({ message: `Invalid status provided. Must be one of: ${validStatuses.join(', ')}.` }); }

    try {
        const booking = await Booking.findById(bookingId).populate('hotel', 'owner'); // Populates hotel owner for authorization
        if (!booking) { return res.status(404).json({ message: 'Booking not found.' }); }

        if (loggedInUserRole === 'owner' && booking.hotel.owner.toString() !== loggedInUserId) { // Authorization: Ownership check
            return res.status(403).json({ message: 'Access denied. You can only manage bookings for hotels you own.' });
        }

        const currentStatus = booking.status;
        const newStatus = status.toLowerCase();

        if (currentStatus === newStatus) 
            { return res.status(400).json({ message: `Booking is already ${newStatus}. No change made.` }); }
        if (currentStatus === 'cancelled' || currentStatus === 'completed') 
            { return res.status(400).json({ message: `Booking is already ${currentStatus} and cannot be changed.` }); }
        if (newStatus === 'confirmed' && currentStatus !== 'pending') 
            { return res.status(400).json({ message: 'Booking can only be confirmed from a "pending" status.' }); }
        if (newStatus === 'cancelled' && !['pending', 'confirmed'].includes(currentStatus))
             { return res.status(400).json({ message: 'Booking can only be cancelled from "pending" or "confirmed" status.' }); }

        booking.status = newStatus;
        await booking.save();

        return res.status(200).json({ message: `Booking status updated to "${newStatus}" successfully.`, booking });

    } catch (error) {
        if (error.name === 'CastError') { return res.status(400).json({ message: "Invalid Booking ID format." }); }
        console.error('Error updating booking status:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

export const getBookingsByHotelId = async (req, res) => {
    const hotelId = req.params.hotelId;
    const loggedInUserId = req.user.id;
    const loggedInUserRole = req.user.role;

    try {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) { return res.status(404).json({ message: 'Hotel not found.' }); }

        if (loggedInUserRole === 'owner' && hotel.owner.toString() !== loggedInUserId) {
            return res.status(403).json({ message: 'Access denied. You can only view bookings for hotels you own.' });
        }

        const bookings = await Booking.find({ hotel: hotelId })
            .populate('user', 'email')
            .populate('roomTypeListing', 'categoryName price');

        if (bookings.length === 0) { return res.status(404).json({ message: 'No bookings found for this hotel.' }); }
        return res.status(200).json(bookings);
    } catch (error) {
        if (error.name === 'CastError') { return res.status(400).json({ message: "Invalid Hotel ID format." }); }
        console.error('Error fetching bookings for hotel:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

export const deleteBooking = async (req, res) => {
    const bookingId = req.params.id;
    try {
        const deletedBooking = await Booking.findByIdAndDelete(bookingId);
        if (!deletedBooking) { return res.status(404).json({ message: "Booking not found." }); }
        return res.status(200).json({ message: "Booking deleted successfully." });
    } catch (error) {
        if (error.name === 'CastError') { return res.status(400).json({ message: "Invalid Booking ID format." }); }
        console.error("Error deleting booking:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

