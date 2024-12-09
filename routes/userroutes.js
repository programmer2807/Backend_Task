const express = require('express');
const { 
    createUser, 
    getAllUsers, 
    getUserById, 
    deleteUser, 
    updateUser, 
    loginUser 
} = require('../controllers/user');
const { 
    createBooking, 
    getBookingsByUser, 
    updateBooking, 
    deleteBooking 
} = require('../controllers/booking');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/', createUser);        
router.post('/login', loginUser);    

router.get('/', verifyToken, getAllUsers);         
router.get('/:id', verifyToken, getUserById);       
router.put('/:id', verifyToken, updateUser);        
router.delete('/:id', verifyToken, deleteUser);     


router.post('/bookings', verifyToken, createBooking); 
router.get('/bookings/:userId', verifyToken, getBookingsByUser); 
router.put('/bookings/:bookingId', verifyToken, verifyAdmin, updateBooking);
router.delete('/bookings/:bookingId', verifyToken, verifyAdmin, deleteBooking); 

module.exports = router;

