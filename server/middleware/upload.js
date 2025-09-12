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
        resourceType = "auto"; 
folder = "onudhabon/materials";
      }
    else if (file.mimetype.startsWith("image"))
      {
        resourceType = "image"; 
folder = "onudhabon/profile_pictures";
      }

    return {
      folder: folder,
      resource_type: resourceType,
      public_id: file.originalname.split(".")[0],
      type: "upload",    
      access_mode: "public",
      use_filename: true,       // ✅ keeps original filename
      unique_filename: false,   // ✅ prevents random suffixes
      overwrite: true  
    };
  },
});

const upload = multer({ storage: storage });

export default upload;
