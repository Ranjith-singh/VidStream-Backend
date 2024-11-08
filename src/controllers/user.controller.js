import {async_handler} from "../utils/async_handler.js"

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

    await res.status(200).json({
        message : "ok"
    })
})

export {register_user}