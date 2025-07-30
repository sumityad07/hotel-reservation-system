// models/RoomTypeListing.js
import mongoose from 'mongoose';

const roomTypeListingSchema = new mongoose.Schema({
    hotel: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    
    categoryName: { 
        type: String,
        required: true,
        trim: true
    },
    price: { 
        type: Number,
        required: true,
        min: 0
    },

    description: { 
        type: String,
        required: true,
        trim: true
    },
    image: { 
        type: String,
        required: true,
        trim: true
    },
    maximumOccupancy: { 
        type: Number,
        required: true,
        min: 1
    },
    freeEntities:{
        type: [String],
        required: true,
        default: "Free wifi"
    },
    category:{
        type: String,
        required: true    
    }
    

}, { timestamps: true });

roomTypeListingSchema.index({ hotel: 1, categoryName: 1 }, { unique: true });

const RoomTypeListing = mongoose.model('RoomTypeListing', roomTypeListingSchema);
export default RoomTypeListing;