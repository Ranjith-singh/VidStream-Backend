// require('dotenv').config({path : '../.env'})

// import dotenv from 'dotenv'

// dotenv.config({
//     path : '../.env'
// })

// import mongoose from 'mongoose';
import express from 'express';
// import { db_name } from './constants.js';

console.log("hello");

const app=express();

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

import connectdb from './db/index.js'

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

