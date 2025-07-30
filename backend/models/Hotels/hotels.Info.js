import mongoose from 'mongoose';

const hotelInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    price:{
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    location:{
        type: String,
        required: true,
    },
    // --- CRITICAL: ADD THIS STATUS FIELD BACK ---
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'], // Allowed values
        default: 'pending', // New hotels are 'pending' by default
        required: true // Status is always required
    }
},{timestamps: true});


const Hotel = mongoose.model('Hotel', hotelInfoSchema);
export default Hotel;