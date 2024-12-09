const jwt = require('jsonwebtoken');
const db = require('../config/db'); 


exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided' });
    }

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        }

        req.userId = decoded.id;

        
        const query = `SELECT role FROM users WHERE id = ?`;
        db.execute(query, [req.userId], (err, results) => {
            if (err || results.length === 0) {
                return res.status(401).json({ success: false, message: 'Unauthorized: Role not found' });
            }
            req.userRole = results[0].role; 
            next();
        });
    });
};


exports.verifyAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
    }
    next();
};
