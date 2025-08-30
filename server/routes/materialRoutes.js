import express from "express";
import { auth } from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import upload from "../middleware/upload.js";
import Material from "../models/Material.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const materials = await Material.find().sort({ date: -1 });
    res.status(200).json(materials);
  } catch (err) {
    console.error("Error fetching materials:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/topics/:subject", async (req, res) => {
  try {
    const { subject } = req.params;
    if (!subject) {
      return res.status(400).json({ error: "Subject is required" });
    }

    const topics = await Material.distinct("topic", { subject });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", auth, checkRole("Educator"), upload.single("file"), async (req, res) => {
  try {
    const {title, description, instructor, version, classLevel, subject, topic } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "File upload failed" });
    }

    const newMaterial = new Material({
      title,
      description,
      instructor: req.user.name,
      version,
      classLevel,
      subject,
      topic,
      fileUrl: req.file.path,
      size: req.file && req.file.size
        ? parseFloat((req.file.size / (1024 * 1024)).toFixed(2))
        : null

    });

    await newMaterial.save();
    res.status(201).json(newMaterial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
