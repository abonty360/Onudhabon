import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { init as initSocket } from './socket.js';
import adminVolunteersRoutes from "./routes/adminVolunteers.js";
import { co2Middleware } from './middleware/co2Middleware.js';
import session from "express-session";

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
import emissionRoutes from "./routes/emissionRoutes.js";

connectDb();

const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      httpOnly: true,         // helps prevent XSS
      secure: false,          // must be false on localhost (true only with HTTPS)
      sameSite: "lax",        // or "none" if you want cross-site cookies
    },
  })
);
app.use(express.json());
initSocket(server);
app.use(co2Middleware);

app.use("/api/user", userRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/forum", forumRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/admin/volunteers", adminVolunteersRoutes);
app.use("/api/emission", emissionRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));

