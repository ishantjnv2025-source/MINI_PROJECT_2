import mongoose,{Schema} from "mongoose"

const fileSchema = new Schema(
    {
        title:{
            type:String,
            required:true,
            trim: true,
        },
        file_name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            default:"",
            trim: true,
        },
        subject:{
            type:String,
            required: true,
            index: true,
        },
        tags:[
        { type: String, lowercase: true, trim: true }
        ],
        fileUrl:{
            type:String,
            required:true,
        },
        uploadedBy:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true
        },
        downloadCount:{
            type:Number,
            default:0
        },
        fileSize:{
            type:Number,
        }
    },{timestamps:true}
);
export const File=mongoose.model("File",fileSchema)