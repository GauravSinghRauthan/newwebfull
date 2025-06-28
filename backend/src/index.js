import dotenv from 'dotenv';
import dbConnect from "./db/index.db.js";
import { app } from './app.js';

dotenv.config({
    path: './.env'
})

dbConnect()

app.listen(process.env.PORT,()=>{
    console.log(`application listen at Port at ${process.env.PORT} `)
})
