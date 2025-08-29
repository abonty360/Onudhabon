import express from "express";
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

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description, subject, classLevel, author, topic } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "File upload failed" });
    }

    const newMaterial = new Material({
      title,
      description,
      subject,
      classLevel,
      author,
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
