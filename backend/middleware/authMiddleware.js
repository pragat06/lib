// File: backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get the token from the request header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Add the user payload to the request object
        next(); // Move on to the next middleware or the route handler
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};