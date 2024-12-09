const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const db = require('../config/db');


const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (enteredPassword, storedPassword) => {
    return await bcrypt.compare(enteredPassword, storedPassword);
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


exports.createUser = async (req, res) => {
    try {
        const { name, email, phone, age, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const query = `INSERT INTO users (name, email, phone, age, password) VALUES (?, ?, ?, ?, ?)`;

        db.execute(query, [name, email, phone, age, hashedPassword], (err, results) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
            const token = generateToken(results.insertId);
            res.status(201).json({ success: true, message: 'User created successfully', userId: results.insertId, token });
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const query = `SELECT * FROM users WHERE email = ?`;
        db.execute(query, [email], async (err, results) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            const user = results[0];
            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Invalid password' });
            }
            const token = generateToken(user.id);
            res.status(200).json({ success: true, message: 'Login successful', userId: user.id, token });
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAllUsers = (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const query = `SELECT * FROM users LIMIT ? OFFSET ?`;

    db.execute(query, [parseInt(limit), offset], (err, results) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
        res.status(200).json({ success: true, users: results, currentPage: parseInt(page) });
    });
};

exports.getUserById = (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM users WHERE id = ?`;

    db.execute(query, [id], (err, results) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user: results[0] });
    });
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, age } = req.body;

    try {
        const query = `
            UPDATE users
            SET 
                name = ?, 
                email = ?, 
                phone = ?, 
                age = ?
            WHERE id = ?`;

        db.execute(query, [name, email, phone, age, id], (err, results) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
            res.status(200).json({ success: true, message: 'User updated successfully' });
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM users WHERE id = ?`;

    db.execute(query, [id], (err, results) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    });
};

// Booking Management Controllers
exports.createBooking = (req, res) => {
    const { userId, eventId, bookingDate } = req.body;
    const query = `INSERT INTO bookings (user_id, event_id, booking_date) VALUES (?, ?, ?)`;

    db.execute(query, [userId, eventId, bookingDate], (err, results) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
        res.status(201).json({ success: true, message: 'Booking created successfully', bookingId: results.insertId });
    });
};

exports.getBookingsByUser = (req, res) => {
    const { userId } = req.params;
    const query = `SELECT * FROM bookings WHERE user_id = ?`;

    db.execute(query, [userId], (err, results) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
        res.status(200).json({ success: true, bookings: results });
    });
};

exports.updateBooking = (req, res) => {
    const { bookingId } = req.params;
    const { bookingDate } = req.body;
    const query = `UPDATE bookings SET booking_date = ? WHERE id = ?`;

    db.execute(query, [bookingDate, bookingId], (err, results) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
        res.status(200).json({ success: true, message: 'Booking updated successfully' });
    });
};

exports.deleteBooking = (req, res) => {
    const { bookingId } = req.params;
    const query = `DELETE FROM bookings WHERE id = ?`;

    db.execute(query, [bookingId], (err, results) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
        res.status(200).json({ success: true, message: 'Booking deleted successfully' });
    });
};
