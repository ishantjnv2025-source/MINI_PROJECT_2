import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import {app} from "./app.js"
import connectDB from "./db/index.js"

connectDB()
.then(()=>{
    app.listen(8000,()=>{
        console.log("App is running on port 8000")
    })
})
.catch((err)=>{
    console.log("MongoDB connection Failed",err)
})