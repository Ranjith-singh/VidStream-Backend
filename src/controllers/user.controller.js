import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const options = {
    httpOnly : true,
    secure : true
}

const generateAccessAndRefreshToken = async (userId) =>{
    try{
        const user = await User.findById(userId);
        const accessToken= await user.generateAccessToken();
        // console.log('accessToken :',accessToken)
        const refreshToken = await user.generateRefreshToken();
        // console.log('refreshToken :',refreshToken)

        user.refreshToken=refreshToken;
        user.save({validateBeforeSave : false})

        return {accessToken,refreshToken}
    }
    catch{
        throw new ApiError(500,
            "Error while generating Access and refresh token"
        )
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    // console.log(req.files?.avatar)
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath = req.files?.coverImage?.[0]?.path ?? "";

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }
    
    // console.log('coverImageLocalPath : ',coverImageLocalPath)

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "upload error")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler( async(req,res) =>{
    // username and password of the user are matching
    // return 401(autherization error) if they don't match
    // return access token if they match so he can preform cred op's
    // if the access token expires return the new access token by taking refresh token

    const {username, email , password} =req.body;

    if(!username && !email){
        throw new ApiError(
            400,
            "provide an username or email" 
        )
    }

    // console.log('email : ',email);

    const user = await User.findOne({
        $or: [{ username: username }, { email: email }]
    })
    

    // console.log("user : ",user);
    // console.log("email : ",user.email);

    if(!user){
        throw new ApiError(404,'user not found')
    }

    // console.log("password : ",password);

    const password_validator=await user.isPasswordCorrect(password);

    if(!password_validator)
    {
        throw new ApiError(401,'incorrect password')
    }

    const {accessToken,refreshToken} =await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")

    // console.log("refresh token :",refreshToken)

    // console.log("Response Data:", {
    //     user: { loggedInUser, accessToken, refreshToken },
    // });

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
         new ApiResponse(
            200,
            {
                user : {loggedInUser,accessToken,refreshToken}
            },
            "User logged in Succesfully"
         )
    ) 


})

const logoutUser = asyncHandler( async(req,res)=>{
    // remove refresh token from User
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )

    return await res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(
        200,
        {},
        "User Logged out"
    ))
})

const getAccessTokenThroughRefreshToken = asyncHandler(async(req,res)=>{

    const userRefreshToken = (req.cookies.refreshToken || req.body.refreshToken)

    if(!userRefreshToken){
        throw new ApiError (
            401,
            "No refresh token found"
        )
    }

    try {
        const decodedRefreshToken = await jwt.verify(userRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById({
            _id : decodedRefreshToken?._id
        })
    
        // No need to check for refresh token passed and db refresh token because
        // jwt has signed the refreshToken when we pass "userRefreshToken" to jwt.verify()
        // it checks for signature as well
    
        if(!user){
            throw new ApiError(
                401,
                "Invalid Refresh token"
            )
        }
    
        const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken : refreshToken},
                "accessToken refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Invalid refresh token"
        )
    }

})

const changePassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword, confirmPassword} = req.body;

    // console.log("oldPassword :",oldPassword);
    // console.log("newPassword :",newPassword);
    // console.log("confirmPassword :",confirmPassword);

    if(newPassword != confirmPassword){
        throw new ApiError(
            401,
            "new password and confirm password are not matching"
        )
    }

    const user =await User.findById({
        _id : req.user._id
    })

    // console.log("user :",user)

    const passwordValidation = await user.isPasswordCorrect(oldPassword)

    if(!passwordValidation){
        throw new ApiError(
            401,
            "provide correct password"
        )
    }

    user.password = newPassword
    await user.save({validateBeforeSave : false})
    
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            {},
            "password changed succesfully"
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getAccessTokenThroughRefreshToken,
    changePassword
}