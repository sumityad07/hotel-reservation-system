import express from "express";
import dotenv from "dotenv";
import db from "./utils/mangoose.js";
import userRoutes from "./routes/users/user.js";
import hotelRoutes from "./routes/hoteLInfo/hotel.js";
import roomRoutes from "./routes/hoteLInfo/roomListing.js";
import bookingRoutes from "./routes/booking/booking.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { getHotelById } from "./controller/hotelInfo.js/hotelinfo.js";
import { protect } from "./middleware/Auth.js";
dotenv.config();


// console.log("Environment variables loaded", process.env.MONGO_URL);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5179', // Your local frontend (current port)
    'http://localhost:5175', // Keep if you use this port sometimes
    'http://localhost:5174', // Keep if you use this port sometimes
    'http://localhost:5173', // Keep if you use this port sometimes
    'http://192.168.29.113:5179', // Your laptop's IP for mobile testing
    'https://hotel-reservation-system-delta.vercel.app', // Your deployed Netlify frontend
    'https://hotel-reservation-system-h4s7.onrender.com', // Your deployed backend (for self-requests if any)
  ],
  credentials: true
}));




app.get('/api/hotel/details/:id', protect, getHotelById);

//routes
app.use('/api/user', userRoutes);
app.use('/api/hotel', hotelRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/booking', bookingRoutes);



//connect to MongoDB
db.then(() => {
  console.log("Database connection established");
}).catch((error) => {
  console.error("Database connection failed:", error);
});

const PORT = process.env.PORT||3000

app.listen(PORT,'0.0.0.0', () => console.log(`Server is running on port ${PORT}`));


