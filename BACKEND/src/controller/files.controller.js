import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {File} from "../models/files.models.js"
import { supabase } from "../utils/supabase.js";
const fileUpload = asyncHandler(async (req, res) => {

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

    const { data: publicUrl } = supabase.storage
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


export {fileUpload,downloadFile,getAll}

