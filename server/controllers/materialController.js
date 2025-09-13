import Material from "../models/Material.js";

export const newMaterial = async (req, res) => {
  try {
    const { title, description, instructor, version, classLevel, subject, topic } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "File upload failed" });
    }
    console.log("Uploaded file data:", req.file);
    const fileUrl = req.file?.secure_url || req.file?.path || null;

    if (!fileUrl) {
      return res.status(400).json({ error: "File URL missing from upload" });
    }

    const material = new Material({
      title,
      description,
      instructor,
      version,
      classLevel,
      subject,
      topic,
      fileUrl,
      size: req.file.size
        ? parseFloat((req.file.size / (1024 * 1024)).toFixed(2))
        : null,
      status: "pending"
    });

    await material.save();
    res.status(201).json({ message: "Material uploaded and pending admin approval", material });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ status: "approved" }).sort({ date: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTopicsBySubject = async (req, res) => {
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
};
