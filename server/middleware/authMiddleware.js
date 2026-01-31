import jwt from 'jsonwebtoken';

export const userMiddleware = (req, res, next) => {
    const token = req.cookies ? req.cookies.accessToken : null;

    if (!token) {
        return res.status(401).json({ message: "No token, autherization denied!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
        }
        res.status(401).json({ message: "Token is not valid" })
    }
};