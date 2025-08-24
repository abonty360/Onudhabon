import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, file) => {
    let resourceType = "auto";
    let folder = "onudhabon"; 
if (file.mimetype.startsWith("video")) {
      resourceType = "video";
      folder = "onudhabon/lectures";
    }
    else if (file.mimetype === "application/pdf") 
      {
        resourceType = "raw"; 
folder = "onudhabon/materials";
      }

    return {
      folder: folder,
      resource_type: resourceType,
      public_id: file.originalname.split(".")[0],
    };
  },
});

const upload = multer({ storage: storage });

export default upload;
