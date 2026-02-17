import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"

//register user
// 1.user will enter the data
// 2.we will take the data and register the user and save the info in the database
const generateAccessAndRefreshToken=async(user)=>{
    try {
        const accessToken=await user.generateAccessToken()
        const refreshToken=await user.generateRefreshToken()
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false})
        return [refreshToken,accessToken]
    } catch (error) {
        throw new ApiError(500,"Unable to Generate Access and Refresh Token")
    }
}

const registerUser=asyncHandler(async(req,res)=>{
    console.log("Req Body:-----",req.body)
    console.log("Headers:", req.headers["content-type"]);
    const {name, email, password }=req.body
    

    if(
        [name, email, password].some((field)=> field?.trim() ==="")
    ){
                throw new ApiError(400,"All fields are required")
    }

    const existedUser=await User.findOne({email});
    if(existedUser){
        throw new ApiError(409,"Email Already Exists ")
    }

    const newUser=await User.create({
        name ,
        email,
        password,
    })

    const response= await User.findById(newUser.id).select(
        "-password"
    )

    if(!response){
        throw new ApiError(500,"Something Went Wrong")
    }

    return res.status(200).json(
        new ApiResponse(200,response,"User Created Successfully")
    )
    
})


const loginUser=asyncHandler(async(req,res)=>{
    

    const {email,password}=req.body;

    const user=await User.findOne({
        email
    })

    if(!user){
        throw new ApiError(404,"User Not Found")
    }
    
    const passwordValid=await user.comparePassword(password)
    
    if(!passwordValid){
        throw new ApiError(400,"Password is wrong")
    }

    const [refreshToken,accessToken]=await generateAccessAndRefreshToken(user)

    res
    .status(201)
    .cookie("refreshToken",refreshToken)
    .cookie("accessToken",accessToken)
    .json(
       new ApiResponse(201,"Login Successful")
    )
})



export {registerUser,loginUser}
