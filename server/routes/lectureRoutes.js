import express from "express";
import upload from "../middleware/upload.js";
import Lecture from "../models/Lecture.js";

const router = express.Router();

router.post("/", upload.single("video"), async (req, res) => {
  try {
    const { title, description, subject, topic, classLevel, instructor, duration } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Video upload failed" });
    }

    const newLecture = new Lecture({
      title,
      description,
      subject,
      topic: topic || "",
      classLevel,
      instructor,
      duration: duration ? Number(duration) : 0,
      videoUrl: req.file.path || req.file.url,  
      thumbnail: req.file.path.replace("/upload/", "/upload/w_300,h_200,c_fill/") // Cloudinary thumbnail
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

export default router;
