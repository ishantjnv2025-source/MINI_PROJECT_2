import mongoose from "mongoose";


const connectDB = async ()=>{
    try{
        const connectionInstance=mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB is running")
    }catch(error){
        console.log("MongoDB connection error")
        process.exit(1)
    }
}

//export default means that you can name it anything you like without using "as" while importing. 

export default connectDB;