import express from 'express';
import { hotelRegister, getAllHotels,
    getHotelById,
    getByHotelName,
    deleteHotel,
    updateHotel, 
    getHotelsByOwner,
    searchHotels} from '../../controller/hotelInfo.js/hotelinfo.js';



const router = express.Router();




import { protect, authorizeRoles } from '../../models/middleware/Auth.js';


// Public routes for viewing hotels
router.get('/allHotels', getAllHotels);
router.get('/:id', getHotelById);
router.get('/by-name/:name', getByHotelName); // Added 'by-name' for clarity, prevents conflict with /:id
router.get('/search',searchHotels)

// Protected routes for managing hotels (owners/admins only)
router.post('/register', protect,  hotelRegister);
router.put('/:id', protect, authorizeRoles('owner', 'admin'), updateHotel);
router.delete('/:id', protect, authorizeRoles('owner', 'admin'), deleteHotel);
router.get("/hotel/byOwner",protect,getHotelsByOwner)


export default router;