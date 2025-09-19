import express from "express";
import { auth, checkRestriction } from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import upload from "../middleware/upload.js";
import Material from "../models/Material.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const materials = await Material.find({ status: "approved" }).sort({ date: -1 });
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

router.post("/", auth, checkRole("Educator"), checkRestriction, upload.single("file"), async (req, res) => {
  try {
    const {title, description, instructor, version, classLevel, subject, topic } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "File upload failed" });
    }

    const newMaterial = new Material({
      title,
      description,
      instructor: req.user._id,
      version,
      classLevel,
      subject,
      topic,
      fileUrl: req.file.secure_url || req.file.path,
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

router.get("/review", auth, checkRole("Admin"), async (req, res) => {
  const pendingMaterials = await Material.find({ status: "pending" }).populate('instructor').sort({ date: -1 });
  res.json(pendingMaterials);
});

router.patch("/:id/approve", auth, checkRole("Admin"), async (req, res) => {
  const material = await Material.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
  res.json({ message: "Material approved", material });
});

router.patch("/:id/decline", auth, checkRole("Admin"), async (req, res) => {
  const material = await Material.findByIdAndUpdate(req.params.id, { status: "declined" }, { new: true });
  res.json({ message: "Material declined", material });
});

router.get("/mine", auth, checkRole("Educator"), checkRestriction, async (req, res) => {
  try {
    const myMaterials = await Material.find({ instructor: req.user._id }).sort({ date: -1 });
    res.json(myMaterials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
