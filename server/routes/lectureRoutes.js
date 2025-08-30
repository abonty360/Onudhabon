import express from "express";
import { auth } from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import upload from "../middleware/upload.js";
import Lecture from "../models/Lecture.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();


router.post("/", auth, checkRole("Educator"), upload.single("video"), async (req, res) => {
  try {
    const { title, description, instructor, version, classLevel, subject, topic } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Video upload failed" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      eager: [{ width: 300, height: 200, crop: "fill", format: "jpg" }] 
    });

    const newLecture = new Lecture({
      title,
      description,
      instructor: req.user.name,
      version,
      classLevel,
      subject,
      topic,
      videoUrl: uploadResult.secure_url,  
      thumbnail: uploadResult.eager[0].secure_url,
    });

    await newLecture.save();
    res.status(201).json(newLecture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const lectures = await Lecture.find().sort({ createdAt: -1 });
    res.status(200).json(lectures);
  } catch (err) {
    console.error("Error fetching lectures:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/topics/:subject", async (req, res) => {
  try {
    const { subject } = req.params;
    if (!subject) {
      return res.status(400).json({ error: "Subject is required" });
    }

    const topics = await Lecture.distinct("topic", { subject });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
