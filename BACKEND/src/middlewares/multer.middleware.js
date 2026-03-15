import { ApiError } from "../utils/ApiError.js";
import multer from "multer"

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    cb(new ApiError(400, "Only PDF files are allowed"), false);
  }
  else{
    cb(null, true);
  }
  
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});