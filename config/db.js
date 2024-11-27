// const mongoose = require("mongoose");

// const connectDb = async () =>{
//     try{
//         const conn = await mongoose.connect(process.env.MongoDB_URL,{
//             useNewUrlParser:true,
//             useUnifiedTopology:true,
//         });
//         console.log("Connected to Db");
//     }
//     catch(err){
//         console.log("Error in connecting to Db")
//         process.exit(1);
//     }
// }
// module.exports = connectDb;

const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
})

db.connect((err)=>{
    if(err){
        console.error("Error connecting in Database",err);
        process.exit(1);
    }
    console.log("Connected to Database");
})
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

module.exports = db;