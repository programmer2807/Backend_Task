// 
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const db = require('../config/db');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, phone, age, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const query = `INSERT INTO users (name, email, phone, age, password) 
                       VALUES ('${name}', '${email}', '${phone}', '${age}', '${hashedPassword}')`;
        db.execute(query, (err, results) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
            res.status(201).json({ success: true, message: 'User created successfully', userId: results.insertId });
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAllUsers = (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const query = `SELECT * FROM users LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    db.execute(query, (err, results) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
        res.status(200).json({ success: true, users: results, currentPage: parseInt(page) });
    });
};

exports.getUserById = (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM users WHERE id = ${id}`;
    db.execute(query, (err, results) => {
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
    const { name, email, phone, age, password } = req.body;

    try {
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const query = `
            UPDATE users
            SET 
                name = '${name}', 
                email = '${email}', 
                phone = '${phone}', 
                age = '${age}', 
                password = ${hashedPassword ? `'${hashedPassword}'` : 'password'}
            WHERE id = ${id}
        `;
        db.execute(query, (err, results) => {
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
    const query = `DELETE FROM users WHERE id = ${id}`;
    db.execute(query, (err, results) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    });
};
