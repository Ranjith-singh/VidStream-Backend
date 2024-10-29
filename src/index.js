// require('dotenv').config({path : '../.env'})

// import dotenv from 'dotenv'

// dotenv.config({
//     path : '../.env'
// })

// import mongoose from 'mongoose';
import express from 'express';
import connectdb from './db/index.js'
import cors from "cors";
import cookieParser from "cookie-parser"
import user_router from "./routes/user.routes.js";
import {app} from "./app.js"
// import { db_name } from './constants.js';
// const app=express();

// app.use(cors({
//     origin : process.env.CORS_ORIGIN,
//     credentials : true
// }))

// app.use(express.json({limit :"16kb"}));
// app.use(express.urlencoded({extended:true,limit:"16kb"}))
// app.use(express.static('public'))
// app.use(cookieParser())

// app.use("/api/v1/users",user_router)

// app.get('/api/v1/users',(req,res)=>{
//     console.log("in users")
//     res.send({
//         "mssg":"in users"
//     })
// })

// app.get('/test',(req,res)=>{
//     console.log("hehehe")
//     res.send({
//         "mssg":"hy"
//     })
// })


// (async ()=>{
//     try
//     {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`)
//         app.on('error',(error)=>
//         {
//             console.log('Err :',error);
//             throw error
//         })

//         console.log(`${process.env.MONGODB_URI}`);

//         app.listen(process.env.PORT,()=>
//         {
//             console.log(`App listening on port ${process.env.PORT}`)
//         })
//     }
//     catch(error)
//     {
//         console.error('ERROR: ',error)
//         throw err
//     }
// })()

// const initialize = async()=>{
//     try
//     {
//         console.log(`${input}`);
//         await mongoose.connect(`${input}/${db_name}`)
//         app.on('error',(error)=>
//         {
//             console.log('Err :',error);
//             throw error
//         })

//         app.listen(port,()=>
//         {
//             console.log(`App listening on port ${port}`)
//         })
//     }
//     catch(error)
//     {
//         console.error('ERROR: ',error)
//         throw err
//     }
// }

// initialize()



connectdb().then(()=>
    {
        app.on("error",(error)=>{
            console.log('Err :',error);
            throw error 
        }) 
        app.listen(process.env.PORT || 8000,()=>
        {
            console.log(`Server is running on port : ${process.env.PORT}`);
        })
    })
.catch((err)=>{
    console.log(`Mongo db connection failed !!!`,err)
})

