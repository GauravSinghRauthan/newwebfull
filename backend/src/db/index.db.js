import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



const dbConnect = async ()=>{
    try {
        const connectMongoDB = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        // console.log(`db host at ${connectMongoDB.connection.host}`);
    } catch (error) {
        console.log('db connect error found',error);
        process.exit(1)
    }
}
export default dbConnect



/*(async()=>{
    try {
        await mongoose.connect(`${process.env.URL_DB}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log(error)
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`appliction run port  no ${process.env,PORT}`)

        })
    } catch (error) {
        console.log("error found",error)
        throw error
    }
})()*/