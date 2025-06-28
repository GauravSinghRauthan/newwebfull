import { asyncHandler } from "../utlits/asyncHandler.js";
import { ApiError } from "../utlits/apiError.js";
import jwt  from "jsonwebtoken";
import { User } from "../modules/user.module.js";


const verifyToken = asyncHandler(async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        console.log(token)

    if(!token){
        throw new ApiError(301,"unauthorize token")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-Password -refreshToken")

    console.log(user)

    if(!user){
        throw new ApiError(304 , "user not found")
    }

    req.user = user

    next()
    } catch (error) {
        throw new ApiError(401 , error?.message || "something went wrong")
    }
})

export default verifyToken