import mongoose ,{Schema} from "mongoose"

import bcript from "bcrypt"
import jwt from "jsonwebtoken"

const user_schema=Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        lowercase : true,
        trim :true,
        index :true  
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase : true,
        trim :true,
    },

    fullname:{
        type:String,
        required:true,
        trim :true,
        index :true  
    },
    avatar:{
        type: String,
        required:true
    },
    coverimage:{
        type : String
    },
    watch_history:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type:String,
        required:[true,"password requied"]
    },
    refersh_token:{
        type:String
    }
},{timestamps:true})

user_schema.pre("save",async function(next){
    if(this.isModified("password"))
    {
        this.password=bcript.hash(this.password,10)
    }
    next()
})

user_schema.methods.isPasswordCorect=async function (password) 
{
    return await bcript.compare(password,this.password)
}

user_schema.methods.generate_accsess_token=async function () 
{
    return jwt.sign(
    {
        _id:this._id,
        email:this.email,
        fullname:this.fullname,
        username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })
}

user_schema.methods.generate_refersh_token=async function () 
{
    jwt.sign(
    {
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    })
}


export const User=mongoose.model("User",user_schema)