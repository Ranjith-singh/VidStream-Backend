import {async_handler} from "../utils/async_handler.js"

const register_user=async_handler(async (req,res)=>
{
    await res.status(200).json({
        message : "ok"
    })
})

export {register_user}