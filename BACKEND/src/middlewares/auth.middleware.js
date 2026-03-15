import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.models.js"

export const verifyJWT=asyncHandler(async (req,res,next)=>{
    try {
        console.log("cookies",req.cookies)
        const token=req.cookies?.accessToken
        if(!token){
            throw new ApiError(401,"Unauthorised Access")
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }
        req.user=user
        next()
    } catch (error) {
        throw new ApiError(400,error?.message || "Something went wrong while verifying jwt")
    }

})