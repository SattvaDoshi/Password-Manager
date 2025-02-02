import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId, masterKey = null) => {
    try {
        const token = jwt.sign({ userId, masterKey }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/'
        });

        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw error;
    }
};