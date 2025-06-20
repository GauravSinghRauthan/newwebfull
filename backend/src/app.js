import express from 'express'
const app = express();

app('/',()=>{
    console.log('hello world');
    
})

app.listen(process.env.PORT,()=>{
    confirm.log(`application listen at Port at ${process.env.PORT} `)
})