import { api_error } from "../utils/api_error.js";
import {async_handler} from "../utils/async_handler.js"
import { User } from "../models/user.models.js";
import { upload_on_cloudinary } from "../utils/cloudinary.js";
import { api_response } from "../utils/api_response.js";

const register_user=async_handler(async (req,res)=>
{
    // get user_name,email,password from frontend
    // validation-not empty
    // already exists user
    // check for images,check for avatar
    // upload to cloudinary through multer
    // create user object-insert to db
    // check for user creation
    // send response

    const {username,email,fullname,password}=req.body;

    console.log("email: ",email)
    // if(fullname==='')
    // {
    //     throw api_error(400,"fullname is re")
    // }

    // if([username,email,fullname,password].some((field)=>
    // field?.trim()==="")
    // ){
    //     throw new api_error(400,'all fiels are required')
    // }

    [username,email,fullname,password].forEach(element => {
        if(element?.trim==='')
        {
            throw new api_error(400,`field :${element} is missing..`)
        }
    });

    const existed_user=User.findOne({
        $or : [{username},{email}]
    })

    if(existed_user){
        throw new api_error(409,"user with email or username already exists")
    }

    const avatar_image_local_path=req.files?.avatar[0]?.path;
    const cover_image_local_path=req.files?.avatar[0]?.path;

    if(!avatar_image_local_path)
    {
        throw new api_error(400,'avatar is required')
    }

    const avatar=await upload_on_cloudinary(avatar_image_local_path);
    const coverImage=await upload_on_cloudinary(cover_image_local_path);

    if(!avatar)
    {
        throw new api_error(400,"upload avatar")
    }

    const user = User.create({
        fullname,
        avatar:avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const created_user=await User.findOne(user._id).select(
        "-password -refersh_token"
    )

    if(!created_user)
    {
        throw new api_error(500,"server down")
    }

    return res.status(201).json(
        new api_response(200,created_user,"user registered Succesfully!")
    )

    // await res.status(200).json({
    //     message : "ok"
    // })
})

export {register_user}