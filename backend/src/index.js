import dotenv from 'dotenv';
import dbConnect from "./db/index.db.js";

dotenv.config({
    path: './.env'
})

dbConnect()
