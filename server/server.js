import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { init as initSocket } from './socket.js';

dotenv.config();
console.log("ENV check:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "loaded" : "missing",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    ? "loaded"
    : "missing",
});

import connectDb from "./db/connect.js";
import userRoutes from "./routes/userRoutes.js";
import lectureRoutes from "./routes/lectureRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import articleRoutes from './routes/articles.js';
import studentRoutes from './routes/studentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

connectDb();

const app = express();
const server = http.createServer(app);
app.use(cors({
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  origin: 'http://localhost:3000'
}));
app.use(express.json());
initSocket(server);

app.use("/api/user", userRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/forum", forumRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));

