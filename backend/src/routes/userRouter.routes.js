import { Router } from "express";
import {userLoging, userLogOut, userRegister} from "../controller/user.controller.js";
import verifyToken from "../middlewares/auth.middlewares.js";
import {upload} from "../middlewares/multer.middleweares.js"

const router = Router()

router.route('/register').post(
    upload.fields([
        {
            name:'avatar',
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]
),
userRegister)

router.route('/login').post(userLoging)

router.route('/logout').post(verifyToken,userLogOut)

export default router