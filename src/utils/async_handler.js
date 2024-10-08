// the function received as argument is passed down to other function

// const async_handler=(func)=>async(req,res,next)=>{
//     try
//     {
//         await func(req,res,next)
//     }
//     catch(err)
//     {
        // res.status(err.code || 500).json({
        //     success: false,
        //     message : err.message
        // })
//     }
// }

const async_handler=(async_handler)=>{
    return (req,res,next)=>{
    Promise.resolve(async_handler(req,res,next)).
    catch((err)=>
        // res.status(err.code || 500).json({
        //     success: false,
        //     message : err.message
        // })
        next(err)
)
}}  

export {async_handler } 