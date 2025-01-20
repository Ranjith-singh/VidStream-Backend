import Router from "express"
import { registerVideo } from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router("./public/temp")

router.route("/register").post(verifyJWT,
    upload.fields([{
        name : "videoFile",
        maxCount : 1
    },
    {
        name : "thumbnail",
        maxCount : 1
    }]),
    registerVideo
)

export default router