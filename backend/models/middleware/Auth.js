import JWT from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token;

    // Check if the Authorization header is present and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header: "Bearer TOKEN_STRING"
            token = req.headers.authorization.split(' ')[1]; // Extract the token string

            console.log("--- BACKEND PROTECT LOG ---");
            console.log("Token from Authorization header:", token); // Now this should show your actual JWT

            // Verify the token using your JWT_SECRET
            const decode = JWT.verify(token, process.env.JWT_SECRET); // Use your actual JWT_SECRET from .env
            console.log("Decoded token payload:", decode);

            // Attach user data (from token payload) to req.user
            req.user = decode; // Attaches the decoded token payload to req.user (e.g., req.user.id)
            console.log("req.user set to:", req.user);

            next(); // Proceed to the next middleware or route handler

        } catch (error) {
            // Token verification failed (e.g., invalid signature, expired, malformed)
            console.error("--- BACKEND PROTECT LOG (Verification FAILED) ---");
            console.error("Token verification failed:", error.message); // This will tell you WHY it failed
            res.status(401).json({ message: "Not authorized, token failed." }); // 401: Invalid token
        }
    } else {
        // No token found in Authorization header or not in 'Bearer' format
        console.log("--- BACKEND PROTECT LOG (No Token) ---");
        console.log("Authorization header missing or not in 'Bearer <token>' format.");
        res.status(401).json({ message: "Not authorized, no token provided." }); // 401: No token
    }
};

export const authorizeRoles = (...roles) => {
    // This function remains the same as it relies on req.user which protect sets
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}