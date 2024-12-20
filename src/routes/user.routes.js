import { Router } from "express";
import {  
    registerUser, loginUser, logoutUser, getAccessTokenThroughRefreshToken, changePassword 
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

router.route("/change-password").post(verifyJWT,changePassword,verifyJWT)

export default router