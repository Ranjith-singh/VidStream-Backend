import { Router } from "express";
import {  
    registerUser, loginUser, logoutUser, getAccessTokenThroughRefreshToken, changePassword, 
    getCurrentUser, updateAccountDetails, updateImage
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

router.route("/updateDetails").post(verifyJWT,updateAccountDetails)

router.route("/updateImage").post(upload.fields([
    {
        name: "Image",
        maxCount: 1
    }]),
    verifyJWT,updateImage)

export default router