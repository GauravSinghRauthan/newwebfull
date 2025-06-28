import { asyncHandler } from "../utlits/asyncHandler.js";
import { ApiError } from "../utlits/apiError.js";
import {User} from '../modules/user.module.js';
import { cloudinaryLink } from "../utlits/cloudinary.js";
import { ApiResponse } from "../utlits/apiResponse.js";

const accessAndRefreshToken = async function(userId){
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(501,error)
    }
}

const userRegister = asyncHandler(async (req,res)=>{
    // Get user details from user
    // Validation {not Empty}
    // Check user already exists : (username or email)
    // Check for images {avator}
    //upload them cloudinary
    // Create user object
    // Remove Password and refresh token field from response
    // Check for user creation
    // return response

    const {fullName, userName, Password,email} =req.body


    // Validation {not Empty}
    if([fullName,userName,Password,email].some((field)=>
    field?.trim() === "")) {
        throw new ApiError(400, 'All field is required')
    }

    // Check user already exists

    const existUser = await User.findOne({
        $or: [{email},{userName}]
    })

    if(existUser){
        throw new ApiError(401,"user already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path

    const coverImageLoaclPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(401,"avatar not exists")
    }

    console.log(avatarLocalPath)
    // upload them cloudinary

    const avatar = await  cloudinaryLink(avatarLocalPath)
    const coverImage = await cloudinaryLink(coverImageLoaclPath)

    console.log(avatar)
    if (!avatar) {
        throw new ApiError(400, `Avatar file is required ${avatarLocalPath}`)
    }

    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        Password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })


    const createUser = await User.findById(
        user._id
    ).select("-Password -refreshToken")

    if(!createUser){
        throw new ApiError(401,"something went wrong while resistering the user")
    }

    return res.status(200).json(
         new ApiResponse(201,createUser,"user resgister successfully")
    )
})


const userLoging = asyncHandler(async (req,res)=>{
    // get details from body
    // validation the credentails
    // find the user 
    // password check 
    //access and refreshToken

    const {userName, email, Password} = req.body

    if(!userName && !email) {
        throw new ApiError(300, "userName or email plz enter")
    }

    const user = await User.findOne({
        $or: [{userName},{email}]
    })

    if(!user){
        throw new ApiError(304,"user not Exits")
    }

    const validatedPassword = await user.isPasswordCorrect(Password)

    if(!validatedPassword){
        throw new ApiError(301,"invalid credentails")
    }

    const {accessToken,refreshToken} = await accessAndRefreshToken(user._id)

    const LoggedInUser = await User.findById(user._id)
    .select("-Password -refreshToken")

    const option = {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(
        new ApiResponse(
            201,
            {
                User: LoggedInUser,refreshToken,accessToken
            },
            "user login in successfully"
        )
    )



})

const userLogOut = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined //remove value in it
            }
        },{
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(201,'user logout successfully')
    )
})



export {
    userRegister,
    userLoging,
    userLogOut

};