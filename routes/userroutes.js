const express = require('express');
const { createUser, getAllUsers, getUserById, deleteUser, updateUser, loginUser } = require('../controllers/user');
const { verifyToken } = require('../middleware/authMiddleware');  

const router = express.Router();

router.post('/', createUser);    
router.post('/login', loginUser);  

router.get('/', verifyToken, getAllUsers);          
router.get('/:id', verifyToken, getUserById);      
router.put('/:id', verifyToken, updateUser);        
router.delete('/:id', verifyToken, deleteUser);     

module.exports = router;
