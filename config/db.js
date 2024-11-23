const mongoose = require("mongoose");

const connectDb = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MongoDB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("Connected to Db");
    }
    catch(err){
        console.log("Error in connecting to Db")
        process.exit(1);
    }
}
module.exports = connectDb;