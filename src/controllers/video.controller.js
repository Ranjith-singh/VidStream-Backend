import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Video } from "../models/video.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerVideo = asyncHandler(async(req,res)=>{

    const keys= Object.keys(req.files);
    // console.log(keys);
    let videoFile, thumbnail;
    for(const key of keys) {
        const localPath= req.files?.[key][0]?.path;
        if(!localPath) {
            throw new ApiError(
                400,
                `${key} file is required`
            );
        }
        if(key== 'videoFile') {
            videoFile= await uploadOnCloudinary(localPath);
        }
        else if(key== 'thumbnail') {
            thumbnail= await uploadOnCloudinary(localPath);
        }
    }

    const {title, description} = req.body
    if(
        [title, description].some((field) => field?.trim === "")
    )
    {
        throw new ApiError(
            400,
            "title and description are required"
        )
    }

    if(!(videoFile || thumbnail)){
        throw new ApiError(
            400,
            "upload error"
        )
    }

    // console.log("user :",req.user)

    const video = await Video.create({
        videoFile : videoFile?.url,
        thumbnail : thumbnail?.url,
        owner : req.user,
        title,
        description,
        duration : videoFile?.duration,
        views : 0,
        isPublished : false
    })

    if(!video){
        throw new ApiError(
            200,
            "Something went wrong while registering the video"
        )
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            video,
            "video registered succesfully"
        )
    )

})

// const getAllVideos = asyncHandler(async(req,res) =>{
//     const {page = 1, limit = 10, query, sortBy, sortType, userId} = req.query

//     const pattern = Object.values(query)[0]

//     const videos = await Video.find{
//         $like : '%query%'
//     }
// })

export {
    registerVideo
}