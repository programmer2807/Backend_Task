const express = require('express');
const { createUser, getAllUsers, getUserById, deletebyID, updateUser } = require('../controllers/user');

const router = express.Router();

router.post('/', createUser);       
router.get('/', getAllUsers);          
router.get('/:id', getUserById);       
router.put('/:id', updateUser);        
router.delete('/:id', deletebyID);     

module.exports = router; // Use CommonJS export
