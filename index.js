const express= require('express');
const cors = require('cors');
const dotenv=require('dotenv');
const connectDaatabase= require('./config/database')


const app= express();
app.use(express.json());

app.use(cors());

dotenv.config({path:'./.env'});

//connecting to database
connectDaatabase();
const server= app.listen(process.env.PORT, ()=>{
    console.log(`Server Started on Port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

//importing routes
const auth= require('./routes/auth');

app.use('/api/v1', auth);