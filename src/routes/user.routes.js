import express from "express";
import { register_user } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router =express.Router()

router.route("/register").post(
    await upload.fields([
        {
            name : 'avatar',
            max_count : 1
        },
        {
            name : 'coverImage',
            max_count : 1
        },
    ]),
    register_user
)

export default router