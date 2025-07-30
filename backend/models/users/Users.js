import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        
    },
    password:{
        type: String,
        required: true
    },
     role: { // <<< This is key for differentiation
        type: String,
        enum: ['user', 'owner', 'admin'], // Define your roles
        default: 'user' // Default for general signups
    }
    
},{timestamps: true}); 

export default mongoose.model('Users', userSchema);