import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Video } from "../models/video.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerVideo = asyncHandler(async(req,res)=>{
    const videoFileLocalPath = req.files?.videoFile[0]?.path
    
    if(!videoFileLocalPath){
        throw new ApiError(
            400,
            "video file is required"
        )
    }

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if(!thumbnailLocalPath){
        throw new ApiError(
            400,
            "thumbNail file is required"
        )
    }

    const {title, description} = req.body

    // const user = await User.find({
    //     username : owner
    // })
    
    // if(!(owner || user)){
    //     throw new ApiError(
    //         400,
    //         "owner info is required or owner not found"
    //     )
    // }

    if(
        [title, description].some((field) => field?.trim === "")
    )
    {
        throw new ApiError(
            400,
            "title and description are required"
        )
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

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
        duration : videoFile.duration,
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

const getAllVideos = asyncHandler(async(req,res) =>{
    const {page = 1, limit = 10, query, sortBy, sortType, userId} = req.query

    const pattern = Object.values(query)[0]

    const videos = await Video.find{
        $like : '%query%'
    }
})

export {
    registerVideo
}