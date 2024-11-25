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

module.exports = db;