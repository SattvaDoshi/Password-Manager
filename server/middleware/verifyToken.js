import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyToken =async  (req, res, next) => {
	try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const user = await User.findById(decoded.userId).select("-password");
            
            if (!user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            req.user = user;
            req.masterKey = decoded.masterKey;
            next();
        } catch (jwtError) {
            console.error("JWT verification failed:", jwtError);
            return res.status(401).json({ message: "Token invalid or expired" });
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({ message: "Server error in authentication" });
    }
};
