import {Router} from "express"
import { fileUpload,downloadFile,getAll } from "../controller/files.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
const router=Router()

router.route("/upload").post(
    verifyJWT,upload.single("file"),
    fileUpload
)

router.get("/download/:id", downloadFile);
router.get("/",getAll)




export default router