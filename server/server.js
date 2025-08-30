import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
console.log("ENV check:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "loaded" : "missing",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "loaded" : "missing",
});

import connectDb from './db/connect.js';
import userRoutes from './routes/userRoutes.js';
import lectureRoutes from './routes/lectureRoutes.js';   
import materialRoutes from './routes/materialRoutes.js';
import forumRoutes from "./routes/forumRoutes.js";

connectDb();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/lectures', lectureRoutes);    
app.use('/api/materials', materialRoutes); 
app.use("/api/forum", forumRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`server running on port ${PORT}`));