import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import cloudinary from "../utils/cloudinary.js"
import {File} from "../models/files.models.js"
const fileUpload=asyncHandler(async(req,res)=>{
    try {
        const {title,description,subject,tags}=req.body;
        if(!title || !subject){
            throw new ApiError(405,"Title and Subject is required")
        }
        if(!req.file){
            throw new ApiError(405,"The file is missing")
        }
        const uploadResult = await cloudinary.uploader.upload_stream(
        { resource_type: "raw" },
        async (error, result) => {
            if (error) throw error;

            const fileDoc = await File.create({
            title,
            description,
            subject,
            tags: tags?.split(","),
            fileUrl: result.secure_url,
            fileSize: req.file.size,
            uploadedBy: req.user._id,
            });

            res.status(201).json({
            message: "File uploaded successfully",
            file: fileDoc,
            });
        }
    );
    uploadResult.end(req.file.buffer);
    } catch (error) {
        console.log("cloudinary error",error)
        throw new ApiError(502,"Error uploading the file on cloudinary",error)
    }
})

const downloadFile=asyncHandler(async(req,res)=>{
    try {
        const id=req.params.id
        const file=await File.findById(id);
        if(!file){
            throw new ApiError(404,"File Not Found")
        }
        file.downloadCount+=1
        await file.save();
        res.redirect(file.fileUrl)
    } catch (error) {
        throw new ApiError(502,"Download failed" )
    }
})

const getAll=asyncHandler(async(req,res)=>{
        const file=await File.find()
            .populate("uploadedBy","name email")
            .sort({ createdAt: -1 })

        if(!file){
            throw new ApiError(404,"files not found")
        }
        res
            .status(200)
            .json(new ApiResponse(200,file,"Fetch successful"))
        

})


export {fileUpload,downloadFile,getAll}

