
//signup
import Users from "../../models/users/Users.js";
import { generateToken } from "../../utils/jwt.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
         try {
          // Check if user already exists
          const trimmedEmail = email.trim().toLowerCase();
            const existingUser = await Users.findOne({ email: trimmedEmail });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists", existingUser: existingUser });
            }
            //hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
           
            // Create new user
            if (!hashedPassword) {
                return res.status(500).json({ message: "Error hashing password" });
            }  
            const newUser = new Users({ email:trimmedEmail, password:hashedPassword });
            await newUser.save();
            generateToken(newUser._id,newUser.role, res);
            return res.status(201).json({ message: "User created successfully", "email": email,role: newUser.role });
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

//login
export const login = async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        try {
            // Find user by email
            const user = await Users.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
            }
            // Generate token and set cookie
            const token = generateToken(user._id,user.role, res);
          
            // Return success response
            res.cookie('token', token, {    
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });  
            return res.status(200).json({ message: "Login successful", token ,role: user.role });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    message: `A user with email "${email}" already exists (database conflict).`,
                    details: error.message
                });
            }
            console.error("Error logging in user:", error);
            return res.status(500).json({ message: "Internal server error","error":error.message });
        }
    }

//logout
export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    return res.status(200).json({ message: "Logout successful" });
}
