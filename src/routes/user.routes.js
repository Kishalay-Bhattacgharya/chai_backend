import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router=Router()


router.route("/register").post(
    upload.fields(
        [{
            name:"avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }]
    ),
    registerUser)

router.route("/login").post(loginUser)    

//secured routes
//Middlewares are used in this way only just give reference as parameter and call next when its execution is over
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/refreshtoken").post(refreshAccessToken)


export default router