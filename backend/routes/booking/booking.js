import express from 'express';
import {
    createBooking,
    getBookingsByUserId,
    getBookingsByHotelId,
    updateBookingStatus,
    deleteBooking,
    getBookingById
} from '../../controller/booking/booking.js';

import { protect, authorizeRoles } from '../../models/middleware/Auth.js';
const router = express.Router();

router.post('/create', protect, authorizeRoles('user', 'owner', 'admin'), createBooking); // Create a new booking
router.get('/my-bookings', protect, authorizeRoles('user', 'owner', 'admin'), getBookingsByUserId); // Get bookings for logged-in user
router.get('/:id', protect,authorizeRoles("owner","admin"),getBookingById);  // Get bookings for a specific hotel
router.put('/:bookingId/status', protect, authorizeRoles('owner', 'admin'), updateBookingStatus); // Update booking status
router.delete('/:id', protect, authorizeRoles('admin'), deleteBooking); // Delete a booking (Admin-only)

export default router;