// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true,
//     },
//     email:{
//         type:String,
//         required:true,
//     },
//     phone:{
//         type:Number,
//         required:true,

//     },
//     age:{
//         type:Number,
//         required:true,
//     }
// });

// module.exports = mongoose.model("User", UserSchema);

const db = require('../config/db');

const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15),
        age INT NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`;

db.execute(createUserTable, (err) => {
    if (err) {
        console.error('Error creating users table:', err);
    } else {
        console.log('Users table is ready');
    }
});
