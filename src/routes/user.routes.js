import { Router } from "express";
import {  
    registerUser, 
    loginUser, 
    logoutUser, 
    getAccessTokenThroughRefreshToken, 
    changePassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router('./public/temp')

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refreshAccessToken").post(getAccessTokenThroughRefreshToken)

router.route("/change-password").post(verifyJWT,changePassword)

router.route("/getUserDetails").post(verifyJWT,getCurrentUser)

router.route("/updateDetails").patch(verifyJWT,updateAccountDetails)

router.route("/updateImage").patch(verifyJWT,upload.single("Image"),updateImage)

router.route("/channel/:username").get(verifyJWT,getUserChannelProfile)

router.route("/watchHistory/:username").get(verifyJWT,getWatchHistory)

export default router