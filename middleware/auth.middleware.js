import jwt from "jsonwebtoken";
import UserModel from "../models/User.model.js";

// Main authentication middleware
export const authMiddleware = async (req, res, next) => {
    try {
        let token;

        // Check for token in multiple places:
        // 1. Authorization header (Bearer token)
        // 2. Cookies
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // If no token found
        if (!token) {
            return res.status(401).json({
                success: false, message: "No token provided. Please login."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database (optional but recommended for fresh data)
        const user = await UserModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false, message: "User not found. Token invalid."
            });
        }

        // Attach user to request object
        req.user = user;

        next();
    } catch (err) {
        console.error("Auth middleware error:", err);

        // Handle specific JWT errors
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false, message: "Invalid token"
            });
        }

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false, message: "Token expired. Please login again."
            });
        }

        // Generic error
        return res.status(401).json({
            success: false, message: "Authentication failed"
        });
    }
};

// Alias for consistency with different naming conventions
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach decoded user info to request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};



//
// // Optional: Check if user is admin
// export const admin = (req, res, next) => {
//     if (req.user && req.user.role === "admin") {
//         next();
//     } else {
//         return res.status(403).json({
//             success: false,
//             message: "Access denied. Admin privileges required."
//         });
//     }
// };
//
// // Optional: Check if user is authenticated (lightweight version without DB lookup)
// export const verifyToken = (req, res, next) => {
//     try {
//         let token;
//
//         if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//             token = req.headers.authorization.split(" ")[1];
//         } else if (req.cookies && req.cookies.token) {
//             token = req.cookies.token;
//         }
//
//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: "No token provided. Please login."
//             });
//         }
//
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Just attach decoded data, no DB lookup
//
//         next();
//     } catch (err) {
//         console.error("Token verification error:", err);
//
//         if (err.name === "TokenExpiredError") {
//             return res.status(401).json({
//                 success: false,
//                 message: "Token expired. Please login again."
//             });
//         }
//
//         return res.status(401).json({
//             success: false,
//             message: "Invalid token"
//         });
//     }
// };
//
// // Optional: Check if user owns the resource
// export const isOwner = (req, res, next) => {
//     // Assuming the resource ID is in req.params.id
//     if (req.user && (req.user.id === req.params.id || req.user._id.toString() === req.params.id)) {
//         next();
//     } else if (req.user && req.user.role === "admin") {
//         // Admins can access any resource
//         next();
//     } else {
//         return res.status(403).json({
//             success: false,
//             message: "Access denied. You can only access your own resources."
//         });
//     }
// };