import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app=express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit :"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static('public'))
app.use(cookieParser())

// routes

import user_router from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users",user_router)

app.get('/test',(req,res)=>{
    console.log("hehehe")
    res.send({
        "mssg":"hy"
    })
})

// http://localhost:8000/api/v1/users/register

export {app}