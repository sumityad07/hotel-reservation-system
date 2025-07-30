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
import { protect } from "./models/middleware/Auth.js";
dotenv.config();


// console.log("Environment variables loaded", process.env.MONGO_URL);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: [
    'https://hotel-reservation-system-pu4l.onrender.com',
      'https://sumithotelbooking.netlify.app',
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


