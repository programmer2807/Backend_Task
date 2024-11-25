
require('dotenv').config();  
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');  
const userRoutes = require('./routes/userroutes');  

const app = express();

app.use(bodyParser.json());


app.use('/api/v1/users', userRoutes);


const PORT = process.env.PORT || 10000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


