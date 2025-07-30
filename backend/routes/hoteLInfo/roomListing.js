import express from 'express';
import { createRoomTypeListing, 
    
    getRoomTypeListingById,
    getRoomTypeListingsByHotel,
    updateRoomTypeListing,
    deleteRoomTypeListing } from '../../controller/hotelInfo.js/roomListing.js';
import { protect, authorizeRoles } from '../../models/middleware/Auth.js';

const router = express.Router();


router.get('/details/:id', getRoomTypeListingById);
router.get('/byHotel/:hotelId', getRoomTypeListingsByHotel);

router.post('/roomlisting', protect, authorizeRoles('owner', 'admin'), createRoomTypeListing);
router.put('/:id', protect, authorizeRoles('owner', 'admin'), updateRoomTypeListing);
router.delete('/:id', protect, authorizeRoles('owner', 'admin'), deleteRoomTypeListing);

export default router;