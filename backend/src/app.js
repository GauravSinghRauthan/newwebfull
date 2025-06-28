import express from 'express';
import cors from 'cors'
import {userRegister} from './controller/user.controller.js';
import cookieParse from "cookie-parser";
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:'16kb'}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))

app.use(express.static('public'))

app.use(cookieParse())


//routes import
import userRoute from './routes/userRouter.routes.js'

//router declaration
app.use('/users',userRoute)

// app.get('/',(res,req)=>{
//    res.
// })



export {app}