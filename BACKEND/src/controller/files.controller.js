import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {File} from "../models/files.models.js"
import { supabase } from "../utils/supabase.js";
import { User } from "../models/user.models.js";
const fileUpload = asyncHandler(async (req, res) => {
    console.log(req.body)
    console.log("FILE:", req.file);
    const { title, description, subject, tags } = req.body;
    if (!title || !subject) {
        throw new ApiError(405, "Title and Subject is required");
    }

    if (!req.file) {
        throw new ApiError(405, "The file is missing");
    }

    const file_name = title + "-" + Date.now() + ".pdf";

    const { data, error } = await supabase.storage
        .from("files")
        .upload(file_name, req.file.buffer, {
            contentType: "application/pdf",
        });

    if (error) {
        throw new ApiError(500, error.message);
    }

    const { data: publicUrl } = await supabase.storage
        .from("files")
        .getPublicUrl(file_name);

    const fileDoc = await File.create({
        title,
        description,
        subject,
        file_name,
        tags: tags?.split(","),
        fileUrl: publicUrl.publicUrl,
        fileSize: req.file.size,
        uploadedBy: req.user._id,
    });

    res.status(201).json({
        message: "File uploaded successfully",
        file: fileDoc,
    });
});

const downloadFile=asyncHandler(async(req,res)=>{
        console.log("lakshya")
        const id=req.params.id
        const file=await File.findById(id);
        if(!file){
            throw new ApiError(404,"File Not Found")
        }
        file.downloadCount+=1
        const originalName=file.title+"pdf"
        await file.save();
        
        console.log(file.fileUrl)
        
        
        res.redirect(file.fileUrl)
})

const getAll=asyncHandler(async(req,res)=>{
        console.log("lakshya srivastava")
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

const getSingle=asyncHandler(async(req,res)=>{
    const id=req.params.id
    const file=await File.findById(id)
    if(!file){
        throw new ApiError(404,"File Not Found ")
    }
    console.log(file)
    res
    .status(200)
    .json(new ApiResponse(200,file,"Fetch Successful"))
})

const myUpload=asyncHandler(async(req,res)=>{
    console.log(req.user)
    const user=req.user
    if(!user){
        throw new ApiError(404,"Unauthorized Access")
    }
    const file=await File.find({uploadedBy:user._id})
    if(!file){
        res
        .status(200)
        .json(new ApiResponse(404,"No File Found"))
    }
    res
    .status(200)
    .json(new ApiResponse(200,file,"Fetched Succesfully"))

})

const searchFile=asyncHandler(async(req,res) => {
    console.log(req.query)
    const {title,subject}=req.query
    const query={}
    if(!title && !subject)  {
        throw new ApiError(404,"Please Enter The Search Parameter")
    }
    if(title){
        query.title = { $regex: title, $options: "i" };
    }
    if(subject){
        query.subject={ $regex: subject, $options: "i" };
    }
    
    const file=await File.find(query)
    
    if(!file){
        throw new ApiError(404,"No File Found")
    }
    
    res
    .status(200)
    .json(new ApiResponse(200,file,"File Fetched Successfully"))
})

const deleteFile=asyncHandler(async(req,res)=>{
    const id=req.params.id
    const file=await File.findById({_id:id})
    if(!file){
        throw new ApiError(404,"No File Found")
    }
    if(file.uploadedBy!=req.user.id){
        throw new ApiError(404,"Unauthorised Access")
    }
    const delFile=await File.findByIdAndDelete({_id:id})
    res
    .status(200)
    .json(new ApiResponse(200,"File Deleted Successfully"))
})
 

const favouriteFile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { fileId } = req.body;

    if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
        throw new ApiError(400, "Invalid File ID");
    }

    const file = await File.findById(fileId);
    if (!file) {
        throw new ApiError(404, "File Not Found");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    const isFav = user.favourites.includes(fileId);

    // ✅ DEFINE update here
    const update = isFav
        ? { $pull: { favourites: fileId } }   // remove
        : { $addToSet: { favourites: fileId } }; // add

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        update,
        { returnDocument: "after" }
    );

    res.status(200).json(
        new ApiResponse(
            200,
            updatedUser.favourites,
            isFav
                ? "Removed from favourites"
                : "Added to favourites"
        )
    );
});

const getFavourites = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId)
        .populate({
            path: "favourites",
            populate: {
                path: "uploadedBy",
                select: "name email"
            }
        });

    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            user.favourites,
            "Favourites fetched successfully"
        )
    );
});




export {fileUpload,downloadFile,getAll,getSingle,myUpload,searchFile,deleteFile,favouriteFile,getFavourites}

